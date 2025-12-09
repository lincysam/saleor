
export const updateCheckoutShippingAddressRequest = (payload: { checkoutId: string; shippingAddress: any }) => ({
  type: 'UPDATE_CHECKOUT_SHIPPING_ADDRESS_REQUEST' as const,
  payload,
});

export const updateCheckoutShippingAddressSuccess = (checkout: any) => ({
  type: 'UPDATE_CHECKOUT_SHIPPING_ADDRESS_SUCCESS' as const,
  payload: checkout,
});

export const updateCheckoutShippingAddressFailure = (error: string) => ({
  type: 'UPDATE_CHECKOUT_SHIPPING_ADDRESS_FAILURE' as const,
  payload: error,
});

export const fetchCheckoutRequest = (payload: { checkoutId: string }) => ({
  type: 'FETCH_CHECKOUT_REQUEST' as const,
  payload,
});

export const fetchCheckoutSuccess = (checkout: any) => ({
  type: 'FETCH_CHECKOUT_SUCCESS' as const,
  payload: checkout,
});

export const fetchCheckoutFailure = (error: string) => ({
  type: 'FETCH_CHECKOUT_FAILURE' as const,
  payload: error,
});

export const updateCheckoutShippingMethodRequest = (payload: { 
  checkoutId: string; 
  shippingMethodId: string 
}) => ({
  type: 'UPDATE_CHECKOUT_SHIPPING_METHOD_REQUEST' as const,
  payload,
});

export const updateCheckoutShippingMethodSuccess = (checkout: any) => ({
  type: 'UPDATE_CHECKOUT_SHIPPING_METHOD_SUCCESS' as const,
  payload: checkout,
});

export const updateCheckoutShippingMethodFailure = (error: string) => ({
  type:'UPDATE_CHECKOUT_SHIPPING_METHOD_FAILURE' as const,
  payload: error,
});

export const fetchShippingMethodsRequest = (checkoutId: string) => ({
  type: 'FETCH_SHIPPING_METHODS_REQUEST' as const,
  payload: { checkoutId },
});

export const fetchShippingMethodsSuccess = (shippingMethods: any[]) => ({
  type: 'FETCH_SHIPPING_METHODS_SUCCESS' as const,
  payload: shippingMethods,
});

export const fetchShippingMethodsFailure = (error: string) => ({
  type: 'FETCH_SHIPPING_METHODS_FAILURE' as const,
  payload: error,
});

// FIXED: Use correct action types for billing address
export const updateCheckoutBillingAddressRequest = (payload: { checkoutId: string; billingAddress: any }) => ({
  type: 'UPDATE_CHECKOUT_BILLING_ADDRESS_REQUEST' as const, // CHANGED THIS
  payload,
});

export const updateCheckoutBillingAddressSuccess = (checkout: any) => ({
  type: 'UPDATE_CHECKOUT_BILLING_ADDRESS_SUCCESS' as const, // CHANGED THIS
  payload: checkout,
});

export const updateCheckoutBillingAddressFailure = (error: string) => ({
  type: 'UPDATE_CHECKOUT_BILLING_ADDRESS_FAILURE' as const, // CHANGED THIS
  payload: error,
});

export const updateCheckoutEmailRequest = (payload: { checkoutId: string; email: string }) => ({
  type: 'UPDATE_CHECKOUT_EMAIL_REQUEST' as const,
  payload,
});

export const updateCheckoutEmailSuccess = (checkout: any) => ({
  type: 'UPDATE_CHECKOUT_EMAIL_SUCCESS' as const,
  payload: checkout,
});

export const updateCheckoutEmailFailure = (error: string) => ({
  type: 'UPDATE_CHECKOUT_EMAIL_FAILURE' as const,
  payload: error,
});


export const updateCartCheckout = (checkout: any) => ({
  type: 'UPDATE_CART_CHECKOUT',
  payload: checkout,
});
export const createCheckoutPaymentRequest = (payload: { checkoutId: string; paymentInput: any }) => ({
  type: 'CREATE_CHECKOUT_PAYMENT_REQUEST' as const,
  payload,
});

export const createCheckoutPaymentSuccess = (payment: any) => ({
  type: 'CREATE_CHECKOUT_PAYMENT_SUCCESS' as const,
  payload: payment,
});

export const createCheckoutPaymentFailure = (error: string) => ({
  type: 'CREATE_CHECKOUT_PAYMENT_FAILURE' as const,
  payload: error,
});

export const completeCheckoutRequest = (payload: { checkoutId: string }) => ({
  type: 'COMPLETE_CHECKOUT_REQUEST' as const,
  payload,
});

export const completeCheckoutSuccess = (order: any) => ({
  type: 'COMPLETE_CHECKOUT_SUCCESS' as const,
  payload: order,
});

export const completeCheckoutFailure = (error: string) => ({
  type: 'COMPLETE_CHECKOUT_FAILURE' as const,
  payload: error,
});

export const getCustomerAddressesRequest = (email: string) => ({
  type: "GET_CUSTOMER_ADDRESSES_REQUEST",
  payload: { email },
});
export const getCustomerAddressesSuccess = (userData: any) => ({
  type: "GET_CUSTOMER_ADDRESSES_SUCCESS",
  payload: userData,
});

export const getCustomerAddressesFailure = (error: string) => ({
  type: "GET_CUSTOMER_ADDRESSES_FAILURE",
  error,
});

export const resetCheckoutOrder = () => ({
  type: 'RESET_CHECKOUT_ORDER' as const,
});
