import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './product.types';
import * as actions from './product.actions';
import apolloClient from '@/lib/apolloClient';
import { 
  GET_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY, 
  GET_PRODUCT_DETAIL, 
  GET_CATEGORIES, 
  SEARCH_PRODUCTS, 
  GET_COLLECTIONS_WITH_PRODUCTS
} from '@/graphql/product.queries';
import { mockProducts, mockCategories } from '@/data/mockData';
import type { Product, Category } from './product.types';
import { buildCategoryTree } from "@/utils/categoryTransform";
import { categoryByPath } from "@/utils/categoryBypath"; 
const SALEOR_CHANNEL = 'ind_retail';


function transformSaleorProduct(node: any) {
  const grossPrice = node.pricing?.priceRange?.start?.gross?.amount || 0;
  const netPrice = node.pricing?.priceRange?.start?.net?.amount || 0;
  const currency = node.pricing?.priceRange?.start?.gross?.currency || 'INR';
  const price = grossPrice;
  const brandAttr = node.attributes.find((attr: any) => attr.attribute.slug === 'brand');
  const subcategory = node.category?.parent?.name || ''; 
  const subSubcategory = node.category?.parent?.parent?.name || '';
  let discount = 0;
  let originalPrice = grossPrice;
  
  if (node.pricing?.onSale && node.pricing?.priceRangeUndiscounted?.start?.gross?.amount) {
    originalPrice = node.pricing.priceRangeUndiscounted.start.gross.amount;
    discount = Math.round(((originalPrice - grossPrice) / originalPrice) * 100);
  }
  else if (node.pricing?.discount?.gross?.amount) {
    const discountAmount = node.pricing.discount.gross.amount;
    originalPrice = grossPrice + discountAmount;
    discount = Math.round((discountAmount / originalPrice) * 100);
  }
   const features = node.attributes?.map((attr: any) => 
    `${attr.attribute.name}: ${attr.values.map((v: any) => v.name).join(', ')}`
  ) || [];
  const thumbnail = node.thumbnail?.url || '';
  const mediaImages = node.media?.map((m: any) => m.url) || [];
  const additionalImages = node.images?.map((img: any) => img.url) || [];
  const allImages = [thumbnail, ...mediaImages, ...additionalImages].filter(Boolean);
 return {
    id: node.id,
    name: node.name,
    slug: node.slug,
    description: node.description || 'No description available',
    thumbnail: thumbnail,
    image: thumbnail || allImages[0] || '',
    media: allImages,
    price: price,
    currency: currency,
    netPrice: netPrice,
    originalPrice: discount > 0 ? originalPrice : undefined,
    category: node.category?.name || '',
    categoryId: node.category?.id || '',
    subcategory: subcategory,
    subSubcategory: subSubcategory,
    brand: brandAttr?.values[0]?.name || 'Generic Brand',
    attributes: node.attributes || [],
    rating: node.rating || 4.0,
    reviewCount: Math.floor(Math.random() * 100) + 1,
    features: features.length > 0 ? features : ['High quality', 'Durable material'],
    inStock: node.isAvailable !== false,
    discount: discount, 
    variants: node.variants || [],
  };
}


function transformSaleorCategory(saleorCategory: any): Category {
  return {
    id: saleorCategory.id,
    name: saleorCategory.name,
    slug: saleorCategory.slug,
    subcategories: saleorCategory.children?.edges?.map((edge: any) => 
      transformSaleorCategory(edge.node)
    ) || [],
  };
}


function* fetchProductsSaga(action: ReturnType<typeof actions.fetchProductsRequest>): Generator<any, void, any> {
  try {
    const variables: any = {
      first: 50,
      channel: SALEOR_CHANNEL,
    };

    if (action.payload?.categoryId) {
      variables.filter = { categories: [action.payload.categoryId] }; 
    }

    const { data } = yield call([apolloClient, 'query'], {
      query: GET_PRODUCTS_BY_CATEGORY,
      variables,
    });

    const products = data.products.edges.map((edge: any) => transformSaleorProduct(edge.node));
    yield put(actions.fetchProductsSuccess(products));
  } catch (error: any) {
    console.warn('API fetch failed, using mock data:', error.message);
    yield put(actions.fetchProductsSuccess(mockProducts));
  }
}


function* fetchProductDetailSaga(action: ReturnType<typeof actions.fetchProductDetailRequest>): Generator<any, void, any> {
  try {
    const { data } = yield call([apolloClient, 'query'], {
      query: GET_PRODUCT_DETAIL,
      variables: {
        id: action.payload,
        channel: SALEOR_CHANNEL,
      },
    });
    console.log('RAW API RESPONSE:', JSON.stringify(data, null, 2));
    if (!data.product) {
      yield put(actions.fetchProductDetailFailure('Product not found'));
      return;
    }

    const product = transformSaleorProduct(data.product);
    yield put(actions.fetchProductDetailSuccess(product));
  } catch (error: any) {
    console.warn('API fetch failed, using mock data:', error.message);
    
    const product = mockProducts.find(p => p.id === action.payload);
    if (product) {
      yield put(actions.fetchProductDetailSuccess(product));
    } else {
      yield put(actions.fetchProductDetailFailure('Product not found'));
    }
  }
}

function* fetchCategoriesSaga(): Generator<any, void, any> {
  try {
    const { data } = yield call([apolloClient, 'query'], {
      query: GET_CATEGORIES,
      variables: {
        first: 100,
        channel: SALEOR_CHANNEL,
      },
    });

    const categories = data.categories.edges.map((edge: any) => 
      transformSaleorCategory(edge.node)
    );

    yield put(actions.fetchCategoriesSuccess(categories));
  } catch (error: any) {
    console.warn('API fetch failed, using mock data:', error.message);
    // Fallback to mock data when API is not available
    yield put(actions.fetchCategoriesSuccess(mockCategories));
  }
}

function* searchProductsSaga(action: ReturnType<typeof actions.searchProductsRequest>): Generator<any, void, any> {
  try {
    const { data } = yield call([apolloClient, 'query'], {
      query: SEARCH_PRODUCTS,
      variables: {
        search: action.payload,
        channel: SALEOR_CHANNEL,
        first: 50,
      },
    });

    const products = data.products.edges.map((edge: any) => 
      transformSaleorProduct(edge.node)
    );

    yield put(actions.searchProductsSuccess(products));
  } catch (error: any) {
    console.warn('API fetch failed, using mock data:', error.message);
    // Fallback to mock data when API is not available
    const searchQuery = action.payload.toLowerCase();
    const filteredProducts = mockProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery) || 
      p.description.toLowerCase().includes(searchQuery)
    );
    yield put(actions.searchProductsSuccess(filteredProducts));
  }
}

function* fetchCollectionsSaga(): Generator<any, void, any> {
  try {
    console.log('Fetching collections with products from Saleor API...');
    
    const { data } = yield call([apolloClient, 'query'], {
      query: GET_COLLECTIONS_WITH_PRODUCTS,
      variables: {
        first: 10,
        channel: SALEOR_CHANNEL,
        filter: { published: 'PUBLISHED' }
      },
    });

    console.log('Collections API Raw Response:', data);

    if (!data?.collections?.edges) {
      console.warn('No collections found in API response');
      yield put(actions.fetchCollectionsSuccess([]));
      return;
    }

    const collections = data.collections.edges
      .filter((edge: any) => edge.node.products.edges.length > 0) // Only collections with products
      .map((edge: any) => {
        const collectionNode = edge.node;
        
        return {
          id: collectionNode.id,
          name: collectionNode.name,
          slug: collectionNode.slug,
          description: collectionNode.description,
          backgroundImage: collectionNode.backgroundImage?.url,
          products: collectionNode.products.edges.map((productEdge: any) => 
            transformSaleorProduct(productEdge.node)
          ),
        };
      });

    console.log('Transformed Collections:', collections);
    yield put(actions.fetchCollectionsSuccess(collections));
    
  } catch (error: any) {
    console.error('Collections API fetch failed:', error.message);
    console.error('Error details:', error);
    
    // Instead of mock data, return empty array
    yield put(actions.fetchCollectionsSuccess([]));
  }
}

export default function* productSaga() {
  yield takeLatest(types.FETCH_PRODUCTS_REQUEST, fetchProductsSaga);
  yield takeLatest(types.FETCH_PRODUCT_DETAIL_REQUEST, fetchProductDetailSaga);
  yield takeLatest(types.FETCH_CATEGORIES_REQUEST, fetchCategoriesSaga);
  yield takeLatest(types.FETCH_COLLECTIONS_REQUEST, fetchCollectionsSaga);
  yield takeLatest(types.SEARCH_PRODUCTS_REQUEST, searchProductsSaga);
}
