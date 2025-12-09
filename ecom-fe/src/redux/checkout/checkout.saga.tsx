
import { call, put, takeEvery } from 'redux-saga/effects';
import apolloClient from '@/lib/apolloClient';
import * as actions from './checkout.actions';
import * as types from './checkout.types';
import { toast } from 'sonner';
import { DocumentNode } from 'graphql';
import { 
  CHECKOUT_SHIPPING_ADDRESS_UPDATE,
  CHECKOUT_BILLING_ADDRESS_UPDATE,
  CHECKOUT_EMAIL_UPDATE,
  // GET_CHECKOUT_SHIPPING_METHODS,
  CHECKOUT_PAYMENT_CREATE,
  CHECKOUT_COMPLETE,
  CHECKOUT_DELIVERYMETHOD_UPDATE,
  CHECKOUT_QUERY,
  GET_CUSTOMER_ADDRESSES, 
} from '@/graphql/checkout.queries';


const executeMutation = function*(mutation: DocumentNode, variables: any): Generator<any, any, any> {
  try {
    const result = yield apolloClient.mutate({
      mutation,
      variables,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

function* updateShippingMethodSaga(action: ReturnType<typeof actions.updateCheckoutShippingMethodRequest>): Generator<any, void, any> {
  try {
    const { checkoutId, shippingMethodId } = action.payload;
    
    const { data } = yield call([apolloClient, 'mutate'], {
      mutation: CHECKOUT_DELIVERYMETHOD_UPDATE,
      variables: { 
        checkoutId, 
        deliveryMethodId: shippingMethodId,
        languageCode: 'EN'
      },
    });
    if (data.checkoutDeliveryMethodUpdate.errors?.length > 0) {
      const errorMessage = data.checkoutDeliveryMethodUpdate.errors[0]?.message || 'Failed to update shipping method';
      yield put(actions.updateCheckoutShippingMethodFailure(errorMessage));
      toast.error(errorMessage);
    } else {
      yield put(actions.updateCheckoutShippingMethodSuccess(data.checkoutDeliveryMethodUpdate.checkout));
      toast.success('Shipping method updated successfully');
    }
  } catch (error: any) {
    yield put(actions.updateCheckoutShippingMethodFailure(error.message));
    toast.error('Failed to update shipping method');
  }
}

function* fetchShippingMethodsSaga(action: ReturnType<typeof actions.fetchShippingMethodsRequest>): Generator<any, void, any> {
  try {
    const { checkoutId } = action.payload;
    
    const { data } = yield call([apolloClient, 'query'], {
      query:  CHECKOUT_QUERY,
      variables: { id:checkoutId ,
      languageCode: 'EN'
      },
      
    });
    
    if (data.checkout?.availableShippingMethods) {
      console.log('Fetched shipping methods:', data.checkout.availableShippingMethods);
      yield put(actions.fetchShippingMethodsSuccess(data.checkout.availableShippingMethods));
    } else {
      yield put(actions.fetchShippingMethodsFailure('No shipping methods available'));
    }
  } catch (error: any) {
    yield put(actions.fetchShippingMethodsFailure(error.message));
    toast.error('Failed to load shipping methods');
  }
}


function* updateCheckoutShippingAddressSaga(action: ReturnType<typeof actions.updateCheckoutShippingAddressRequest>): Generator<any, void, any> {
  try {
    const { checkoutId, shippingAddress } = action.payload;
    console.log('🟡 SAGA: Starting shipping address update', {
      checkoutId,
      shippingAddress
    });
     const updatedShippingAddress = {
      ...shippingAddress,
      countryArea: shippingAddress.countryArea || 'Karnataka',
      country: shippingAddress.countryCode || 'IN'
    };
    const variables = {
      checkoutId,
      shippingAddress:updatedShippingAddress,
      languageCode: 'EN'
    };

    const { data } = yield call(executeMutation, CHECKOUT_SHIPPING_ADDRESS_UPDATE, variables);
   
    if (data.checkoutShippingAddressUpdate.errors && data.checkoutShippingAddressUpdate.errors.length > 0) {
      const errorMessage = data.checkoutShippingAddressUpdate.errors[0].message;
      yield put(actions.updateCheckoutShippingAddressFailure(errorMessage));
      toast.error(`Failed to update shipping address: ${errorMessage}`);
      return;
    }

    yield put(actions.updateCheckoutShippingAddressSuccess(data.checkoutShippingAddressUpdate.checkout));
    toast.success('Shipping address updated successfully');

  } catch (error: any) {
    console.error('Shipping address update failed:', error);
    yield put(actions.updateCheckoutShippingAddressFailure(error.message));
    toast.error('Failed to update shipping address');
  }
}


function* updateCheckoutBillingAddressSaga(action: ReturnType<typeof actions.updateCheckoutBillingAddressRequest>): Generator<any, void, any> {
  try {
    const { checkoutId, billingAddress } = action.payload;
    const updatedBillingAddress = {
      ...billingAddress,
      countryArea: billingAddress.countryArea || 'Karnataka',
      country: billingAddress.countryCode || 'IN'
    };
    const variables = {
      checkoutId,
      billingAddress:updatedBillingAddress ,
      languageCode: 'EN'
    };


    const { data } = yield call(executeMutation, CHECKOUT_BILLING_ADDRESS_UPDATE, variables);

    if (data.checkoutBillingAddressUpdate.errors && data.checkoutBillingAddressUpdate.errors.length > 0) {
      const errorMessage = data.checkoutBillingAddressUpdate.errors[0].message;
      yield put(actions.updateCheckoutBillingAddressFailure(errorMessage));
      toast.error(`Failed to update billing address: ${errorMessage}`);
      return;
    }

    yield put(actions.updateCheckoutBillingAddressSuccess(data.checkoutBillingAddressUpdate.checkout));
    toast.success('Billing address updated successfully');
  } catch (error: any) {
    yield put(actions.updateCheckoutBillingAddressFailure(error.message));
    toast.error('Failed to update billing address');
  }
}


function* updateCheckoutEmailSaga(action: ReturnType<typeof actions.updateCheckoutEmailRequest>): Generator<any, void, any> {
  try {
    const { checkoutId, email } = action.payload;

    const variables = {
      checkoutId,
      email  
    };
    const { data } = yield call(executeMutation, CHECKOUT_EMAIL_UPDATE, variables);

    if (data.checkoutEmailUpdate.errors && data.checkoutEmailUpdate.errors.length > 0) {
      const errorMessage = data.checkoutEmailUpdate.errors[0].message;
      yield put(actions.updateCheckoutEmailFailure(errorMessage));
      toast.error(`Failed to update email: ${errorMessage}`);
      return;
    }

    yield put(actions.updateCheckoutEmailSuccess(data.checkoutEmailUpdate.checkout));
 

  } catch (error: any) {
    
    yield put(actions.updateCheckoutEmailFailure(error.message));
    toast.error('Failed to update email');
  }
}


function* createCheckoutPaymentSaga(action: ReturnType<typeof actions.createCheckoutPaymentRequest>): Generator<any, void, any> {
  try {
    const { checkoutId, paymentInput } = action.payload;

    const variables = {
      checkoutId,
      paymentInput,
    };


    const { data } = yield call(executeMutation, CHECKOUT_PAYMENT_CREATE, variables);

    if (data.checkoutPaymentCreate.errors && data.checkoutPaymentCreate.errors.length > 0) {
      const errorMessage = data.checkoutPaymentCreate.errors[0].message;
      yield put(actions.createCheckoutPaymentFailure(errorMessage));
      toast.error(`Failed to create payment: ${errorMessage}`);
      return;
    }

    yield put(actions.createCheckoutPaymentSuccess(data.checkoutPaymentCreate.payment));
    toast.success('Payment created successfully');

  } catch (error: any) {
    console.error('Payment creation failed:', error);
    yield put(actions.createCheckoutPaymentFailure(error.message));
    toast.error('Failed to create payment');
  }
}

function* completeCheckoutSaga(action: ReturnType<typeof actions.completeCheckoutRequest>): Generator<any, void, any> {
  try {
    const { checkoutId } = action.payload;

    const variables = {
      checkoutId,
    };

    console.log('Completing checkout with variables:', variables);

    const { data } = yield call(executeMutation, CHECKOUT_COMPLETE, variables);

    if (data.checkoutComplete.errors && data.checkoutComplete.errors.length > 0) {
      const errorMessage = data.checkoutComplete.errors[0].message;
      yield put(actions.completeCheckoutFailure(errorMessage));
      toast.error(`Failed to complete checkout: ${errorMessage}`);
      return;
    }

    yield put(actions.completeCheckoutSuccess(data.checkoutComplete.order));
    toast.success('Checkout completed successfully');

  } catch (error: any) {
    console.error('Checkout completion failed:', error);
    yield put(actions.completeCheckoutFailure(error.message));
    toast.error('Failed to complete checkout');
  }
}


 function* getCustomerAddressesSaga(
  action: ReturnType<typeof actions.getCustomerAddressesRequest>
): Generator<any, void, any> {
  try {
    const { email } = action.payload;

    const { data } = yield call([apolloClient, "query"], {
      query: GET_CUSTOMER_ADDRESSES,
      variables: { email },
      fetchPolicy: "network-only",
    });

    if (data?.user) {
     
      yield put(actions.getCustomerAddressesSuccess(data.user));
    } else {
      yield put(actions.getCustomerAddressesFailure("User not Registered"));
      toast.error("User not registered");
    }

  } catch (error: any) {
    yield put(actions.getCustomerAddressesFailure(error.message));
    toast.error("Failed to fetch customer Data");
  }
}


export default function* checkoutSagas() {
  yield takeEvery(types.UPDATE_CHECKOUT_SHIPPING_ADDRESS_REQUEST, updateCheckoutShippingAddressSaga);
  yield takeEvery(types.UPDATE_CHECKOUT_BILLING_ADDRESS_REQUEST, updateCheckoutBillingAddressSaga);
  yield takeEvery(types.UPDATE_CHECKOUT_EMAIL_REQUEST, updateCheckoutEmailSaga);
  yield takeEvery(types.UPDATE_CHECKOUT_SHIPPING_METHOD_REQUEST, updateShippingMethodSaga); 
  yield takeEvery(types.FETCH_SHIPPING_METHODS_REQUEST, fetchShippingMethodsSaga);
  yield takeEvery(types.CREATE_CHECKOUT_PAYMENT_REQUEST, createCheckoutPaymentSaga);
  yield takeEvery(types.GET_CUSTOMER_ADDRESSES_REQUEST, getCustomerAddressesSaga);
  yield takeEvery(types.COMPLETE_CHECKOUT_REQUEST, completeCheckoutSaga);
  // yield takeEvery(types.FETCH_CHECKOUT_REQUEST, fetchCheckoutSaga); 
}