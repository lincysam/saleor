
export const UPDATE_CHECKOUT_SHIPPING_ADDRESS_REQUEST = 'UPDATE_CHECKOUT_SHIPPING_ADDRESS_REQUEST';
export const UPDATE_CHECKOUT_SHIPPING_ADDRESS_SUCCESS = 'UPDATE_CHECKOUT_SHIPPING_ADDRESS_SUCCESS';
export const UPDATE_CHECKOUT_SHIPPING_ADDRESS_FAILURE = 'UPDATE_CHECKOUT_SHIPPING_ADDRESS_FAILURE';

export const UPDATE_CHECKOUT_BILLING_ADDRESS_REQUEST = 'UPDATE_CHECKOUT_BILLING_ADDRESS_REQUEST';
export const UPDATE_CHECKOUT_BILLING_ADDRESS_SUCCESS = 'UPDATE_CHECKOUT_BILLING_ADDRESS_SUCCESS';
export const UPDATE_CHECKOUT_BILLING_ADDRESS_FAILURE = 'UPDATE_CHECKOUT_BILLING_ADDRESS_FAILURE';

export const UPDATE_CHECKOUT_EMAIL_REQUEST = 'UPDATE_CHECKOUT_EMAIL_REQUEST';
export const UPDATE_CHECKOUT_EMAIL_SUCCESS = 'UPDATE_CHECKOUT_EMAIL_SUCCESS';
export const UPDATE_CHECKOUT_EMAIL_FAILURE = 'UPDATE_CHECKOUT_EMAIL_FAILURE';

export const FETCH_CHECKOUT_REQUEST = 'FETCH_CHECKOUT_REQUEST';
export const FETCH_CHECKOUT_SUCCESS = 'FETCH_CHECKOUT_SUCCESS';
export const FETCH_CHECKOUT_FAILURE = 'FETCH_CHECKOUT_FAILURE'; // FIXED TYPO

export const UPDATE_CHECKOUT_SHIPPING_METHOD_REQUEST = 'UPDATE_CHECKOUT_SHIPPING_METHOD_REQUEST';
export const UPDATE_CHECKOUT_SHIPPING_METHOD_SUCCESS = 'UPDATE_CHECKOUT_SHIPPING_METHOD_SUCCESS';
export const UPDATE_CHECKOUT_SHIPPING_METHOD_FAILURE = 'UPDATE_CHECKOUT_SHIPPING_METHOD_FAILURE';

export const FETCH_SHIPPING_METHODS_REQUEST = 'FETCH_SHIPPING_METHODS_REQUEST';
export const FETCH_SHIPPING_METHODS_SUCCESS = 'FETCH_SHIPPING_METHODS_SUCCESS';
export const FETCH_SHIPPING_METHODS_FAILURE = 'FETCH_SHIPPING_METHODS_FAILURE';

export const CREATE_CHECKOUT_PAYMENT_REQUEST = 'CREATE_CHECKOUT_PAYMENT_REQUEST';
export const CREATE_CHECKOUT_PAYMENT_SUCCESS = 'CREATE_CHECKOUT_PAYMENT_SUCCESS';
export const CREATE_CHECKOUT_PAYMENT_FAILURE = 'CREATE_CHECKOUT_PAYMENT_FAILURE';

export const COMPLETE_CHECKOUT_REQUEST = 'COMPLETE_CHECKOUT_REQUEST';
export const COMPLETE_CHECKOUT_SUCCESS = 'COMPLETE_CHECKOUT_SUCCESS';
export const COMPLETE_CHECKOUT_FAILURE = 'COMPLETE_CHECKOUT_FAILURE';
export const GET_CUSTOMER_ADDRESSES_REQUEST ='GET_CUSTOMER_ADDRESSES_REQUEST'
export const GET_CUSTOMER_ADDRESSES_FAILURE ='GET_CUSTOMER_ADDRESSES_FAILURE'
export const RESET_CHECKOUT_ORDER = 'RESET_CHECKOUT_ORDER';


export interface CustomerState {
  loading: boolean;
  error: string | null;
  user: any | null;
  addresses: any[];
  defaultBilling: any | null;
  defaultShipping: any | null;
}

export interface CheckoutState {
  shippingAddress: any | null;
  billingAddress: any | null;
  email: string | null;
  shippingMethod: any | null;
  payment: any | null;
  order: any | null;
  loading: boolean;
  error: string | null;
  availableShippingMethods: ShippingMethod[];
  checkout: any | null;
  updatingShippingMethod: boolean;
  isShippingAddressSaved: boolean;
  isBillingAddressSaved: boolean;

  customer: CustomerState;
}

export interface AddressInput {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  country: string;
  countryArea?: string;
  postalCode: string;
  phone?: string;
}

export interface PaymentInput {
  gateway: string;
  amount: number;
  token: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  minimumDeliveryDays?: number;
  maximumDeliveryDays?: number;
}