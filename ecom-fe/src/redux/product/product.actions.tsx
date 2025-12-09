import * as types from './product.types';
export const fetchProductsRequest = (filters?: { categoryId?: string | null, search?: string | null }) => ({
  type: types.FETCH_PRODUCTS_REQUEST,
  payload: filters,
});

export const fetchProductsSuccess = (products: types.Product[]) => ({
  type: types.FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProductsFailure = (error: string) => ({
  type: types.FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const fetchProductDetailRequest = (id: string) => ({
  type: types.FETCH_PRODUCT_DETAIL_REQUEST,
  payload: id,
});

export const fetchProductDetailSuccess = (product: types.Product) => ({
  type: types.FETCH_PRODUCT_DETAIL_SUCCESS,
  payload: product,
});

export const fetchProductDetailFailure = (error: string) => ({
  type: types.FETCH_PRODUCT_DETAIL_FAILURE,
  payload: error,
});

export const fetchCategoriesRequest = () => ({
  type: types.FETCH_CATEGORIES_REQUEST,
});

export const fetchCategoriesSuccess = (categories: types.Category[]) => ({
  type: types.FETCH_CATEGORIES_SUCCESS,
  payload: categories,
});

export const fetchCategoriesFailure = (error: string) => ({
  type: types.FETCH_CATEGORIES_FAILURE,
  payload: error,
});

export const searchProductsRequest = (query: string) => ({
  type: types.SEARCH_PRODUCTS_REQUEST,
  payload: query,
});

export const searchProductsSuccess = (products: types.Product[]) => ({
  type: types.SEARCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const searchProductsFailure = (error: string) => ({
  type: types.SEARCH_PRODUCTS_FAILURE,
  payload: error,
});

export const fetchCollectionsRequest = () => ({
  type: types.FETCH_COLLECTIONS_REQUEST,
});

export const fetchCollectionsSuccess = (collections: types.Collection[]) => ({
  type: types.FETCH_COLLECTIONS_SUCCESS,
  payload: collections,
});

export const fetchCollectionsFailure = (error: string) => ({
  type: types.FETCH_COLLECTIONS_FAILURE,
  payload: error,
});
