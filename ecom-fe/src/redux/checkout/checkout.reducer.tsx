import * as types from './checkout.types';

const initialCustomerState: types.CustomerState = {
  loading: false,
  error: null,
  user: null,
  addresses: [],
  defaultBilling: null,
  defaultShipping: null,
};

const initialState: types.CheckoutState = {
  shippingAddress: null,
  billingAddress: null,
  email: null,
  shippingMethod: null,
  payment: null,
  order: null,
  loading: false,
  error: null,
  availableShippingMethods: [],
  updatingShippingMethod: false,
  checkout: null,
  isShippingAddressSaved: false,
  isBillingAddressSaved: false,

  customer: initialCustomerState,
};

const checkoutReducer = (state = initialState, action: any): types.CheckoutState => {
  switch (action.type) {
    // Shipping Address
    case types.UPDATE_CHECKOUT_SHIPPING_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        isShippingAddressSaved: false,
      };

    case types.UPDATE_CHECKOUT_SHIPPING_ADDRESS_SUCCESS:
      console.log('Shipping address success payload:', action.payload);
      return {
        ...state,
        loading: false,
        shippingAddress: action.payload.shippingAddress,
        checkout: action.payload,
        error: null,
        isShippingAddressSaved: true,
      };

    case types.UPDATE_CHECKOUT_SHIPPING_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isShippingAddressSaved: false,
      };

    // Billing Address
    case types.UPDATE_CHECKOUT_BILLING_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        isBillingAddressSaved: false,
      };

    case types.UPDATE_CHECKOUT_BILLING_ADDRESS_SUCCESS:
      console.log('Billing address success payload:', action.payload);
      return {
        ...state,
        loading: false,
        billingAddress: action.payload.billingAddress,
        checkout: action.payload,
        error: null,
        isBillingAddressSaved: true,
      };

    case types.UPDATE_CHECKOUT_BILLING_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isBillingAddressSaved: false,
      };

    // Email
    case types.UPDATE_CHECKOUT_EMAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.UPDATE_CHECKOUT_EMAIL_SUCCESS:
      console.log('Email success payload:', action.payload);
      return {
        ...state,
        loading: false,
        email: action.payload.email,
        checkout: action.payload,
        error: null,
      };

    case types.UPDATE_CHECKOUT_EMAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Shipping Method
    case types.UPDATE_CHECKOUT_SHIPPING_METHOD_REQUEST:
      return {
        ...state,
        updatingShippingMethod: true,
        error: null,
      };

case types.UPDATE_CHECKOUT_SHIPPING_METHOD_SUCCESS:
  return {
    ...state,
    updatingShippingMethod: false,
    // Handle both Saleor `shippingMethod` and `deliveryMethod` naming
    shippingMethod: action.payload.shippingMethod || action.payload.deliveryMethod || null,
    checkout: action.payload,
    error: null,
  };


    case types.UPDATE_CHECKOUT_SHIPPING_METHOD_FAILURE:
      return {
        ...state,
        updatingShippingMethod: false,
        error: action.payload,
      };

    // Fetch Shipping Methods
    case types.FETCH_SHIPPING_METHODS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_SHIPPING_METHODS_SUCCESS:
      return {
        ...state,
        loading: false,
        availableShippingMethods: action.payload,
        error: null,
      };

    case types.FETCH_SHIPPING_METHODS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Fetch Checkout
    case types.FETCH_CHECKOUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

case types.FETCH_CHECKOUT_SUCCESS:
  console.log('Fetch checkout success payload:', action.payload);
  return {
    ...state,
    loading: false,
    shippingAddress: action.payload.shippingAddress,
    billingAddress: action.payload.billingAddress,
    email: action.payload.email,
    shippingMethod: action.payload.shippingMethod || action.payload.deliveryMethod || null,
    checkout: action.payload,
    error: null,
    availableShippingMethods:
      action.payload.availableShippingMethods ?? state.availableShippingMethods,
  };


    case types.FETCH_CHECKOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Payment
    case types.CREATE_CHECKOUT_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.CREATE_CHECKOUT_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        payment: action.payload,
        error: null,
      };

    case types.CREATE_CHECKOUT_PAYMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Complete Checkout
    case types.COMPLETE_CHECKOUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.COMPLETE_CHECKOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: null,
      };

    case types.COMPLETE_CHECKOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case types.RESET_CHECKOUT_ORDER:
  return {
    ...state,
    order: null, // Reset the order state
    loading: false,
    error: null,
  };

    default:
      return state;
  }
};

export default checkoutReducer;
