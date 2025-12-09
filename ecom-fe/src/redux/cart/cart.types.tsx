export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';

export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';

export const CREATE_CHECKOUT_REQUEST = 'CREATE_CHECKOUT_REQUEST';
export const CREATE_CHECKOUT_SUCCESS = 'CREATE_CHECKOUT_SUCCESS';
export const CREATE_CHECKOUT_FAILURE = 'CREATE_CHECKOUT_FAILURE';

export const UPDATE_CHECKOUT_LINES_REQUEST = 'UPDATE_CHECKOUT_LINES_REQUEST';
export const UPDATE_CHECKOUT_LINES_SUCCESS = 'UPDATE_CHECKOUT_LINES_SUCCESS';
export const UPDATE_CHECKOUT_LINES_FAILURE = 'UPDATE_CHECKOUT_LINES_FAILURE';
export const SYNC_CART_FROM_CHECKOUT = 'SYNC_CART_FROM_CHECKOUT';
export const FETCH_CHECKOUT_REQUEST = 'FETCH_CHECKOUT_REQUEST';
export const FETCH_CHECKOUT_SUCCESS = 'FETCH_CHECKOUT_SUCCESS';
export const FETCH_CHECKOUT_FAILURE = 'FETCH_CHECKOUT_FAILURE';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  currency: string;
  variant?: { 
    id: string;
    name: string;
    sku: string;
    attributes?: any[];
  };
}

export interface CartState {
  items: CartItem[];
  wishlist: string[];
  total: number;
  itemCount: number;
  checkout: {
    id: string;      
    token: string;  
    lines: any[];
    currency: string;
    totalPrice: number;
    subtotalPrice: number;
    shippingPrice: number;
    availablePaymentGateways: any[];
    availableShippingMethods: any[];
    isShippingRequired: boolean;
  } | null;
  loading: boolean;
  error: string | null;
}