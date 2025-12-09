import * as types from './product.types';

const initialState: types.ProductState = {
  products: [],
  productDetail: null,
  categories: [],
  collections: [],
  loading: false,
  error: null,
  searchQuery: '',
  filters: {},
};

const productReducer = (state = initialState, action: any): types.ProductState => {
  switch (action.type) {
    case types.FETCH_PRODUCTS_REQUEST:
    case types.FETCH_PRODUCT_DETAIL_REQUEST:
    case types.FETCH_CATEGORIES_REQUEST:
    case types.SEARCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_PRODUCTS_SUCCESS:
    case types.SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };

    case types.FETCH_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        productDetail: action.payload,
        loading: false,
        error: null,
      };

    case types.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        loading: false,
        error: null,
      };

    case types.FETCH_PRODUCTS_FAILURE:
    case types.FETCH_PRODUCT_DETAIL_FAILURE:
    case types.FETCH_CATEGORIES_FAILURE:
    case types.SEARCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

          case types.FETCH_COLLECTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_COLLECTIONS_SUCCESS:
      return {
        ...state,
        collections: action.payload,
        loading: false,
        error: null,
      };

    case types.FETCH_COLLECTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default productReducer;
