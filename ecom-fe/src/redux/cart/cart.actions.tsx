import * as types from './cart.types';

export const addToCart = (item: Omit<types.CartItem, 'quantity'>) => ({
  type: types.ADD_TO_CART,
  payload: item,
});

export const removeFromCart = (productId: string) => ({
  type: types.REMOVE_FROM_CART,
  payload: productId,
});

export const updateCartQuantity = (productId: string, quantity: number) => ({
  type: types.UPDATE_CART_QUANTITY,
  payload: { productId, quantity },
});

export const clearCart = () => ({
  type: types.CLEAR_CART,
});

export const addToWishlist = (productId: string) => ({
  type: types.ADD_TO_WISHLIST,
  payload: productId,
});

export const removeFromWishlist = (productId: string) => ({
  type: types.REMOVE_FROM_WISHLIST,
  payload: productId,
});

export const createCheckoutRequest = () => ({
  type: types.CREATE_CHECKOUT_REQUEST,
});

export const createCheckoutSuccess = (checkout: any) => ({
  type: types.CREATE_CHECKOUT_SUCCESS,
  payload: checkout,
});

export const createCheckoutFailure = (error: string) => ({
  type: types.CREATE_CHECKOUT_FAILURE,
  payload: error,
});

export const updateCheckoutLinesRequest = (payload: { checkoutId: string; lines: Array<{ variantId: string; quantity: number }> }) => ({
  type: types.UPDATE_CHECKOUT_LINES_REQUEST,
  payload,
});

export const updateCheckoutLinesSuccess = (checkout: any) => ({
  type: types.UPDATE_CHECKOUT_LINES_SUCCESS,
  payload: checkout,
});

export const updateCheckoutLinesFailure = (error: string) => ({
  type: types.UPDATE_CHECKOUT_LINES_FAILURE,
  payload: error,
});

export const syncCartFromCheckout = (checkout: any) => ({
  type: types.SYNC_CART_FROM_CHECKOUT,
  payload: checkout,
});

export const fetchCheckoutRequest = (checkoutId: string) => ({
  type: 'FETCH_CHECKOUT_REQUEST',
  payload: checkoutId,
});

export const fetchCheckoutSuccess = (checkout: any) => ({
  type: 'FETCH_CHECKOUT_SUCCESS',
  payload: checkout,
});

export const fetchCheckoutFailure = (error: string) => ({
  type: 'FETCH_CHECKOUT_FAILURE',
  payload: error,
});

export const updateCartCheckout = (checkout: any) => ({
  type: 'UPDATE_CART_CHECKOUT',
  payload: checkout,
});