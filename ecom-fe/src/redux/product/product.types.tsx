export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const FETCH_PRODUCT_DETAIL_REQUEST = 'FETCH_PRODUCT_DETAIL_REQUEST';
export const FETCH_PRODUCT_DETAIL_SUCCESS = 'FETCH_PRODUCT_DETAIL_SUCCESS';
export const FETCH_PRODUCT_DETAIL_FAILURE = 'FETCH_PRODUCT_DETAIL_FAILURE';

export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

export const SEARCH_PRODUCTS_REQUEST = 'SEARCH_PRODUCTS_REQUEST';
export const SEARCH_PRODUCTS_SUCCESS = 'SEARCH_PRODUCTS_SUCCESS';
export const SEARCH_PRODUCTS_FAILURE = 'SEARCH_PRODUCTS_FAILURE';

export const FETCH_COLLECTIONS_REQUEST = 'FETCH_COLLECTIONS_REQUEST';
export const FETCH_COLLECTIONS_SUCCESS = 'FETCH_COLLECTIONS_SUCCESS';
export const FETCH_COLLECTIONS_FAILURE = 'FETCH_COLLECTIONS_FAILURE';


export interface Product {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  image?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  category?: string;
  categoryId?: string;
  subcategory?: string;      // <-- add this
  subSubcategory?: string;   // <-- add this
  brand?: string;
  attributes?: any[];
  rating?: number;
  reviewCount?: number;
  features?: string[];
  inStock?: boolean;
  discount?: number;
  variants?: any[];
}


export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  image?: string;
  subcategories?: Category[];
}

export interface ProductState {
  products: Product[];
  productDetail: Product | null;
  categories: Category[];
  collections: Collection[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    brand?: string[];
  };
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  backgroundImage?: string;
  products: Product[];
}
