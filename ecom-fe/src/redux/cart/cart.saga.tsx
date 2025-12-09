import { all } from 'redux-saga/effects';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import apolloClient from '@/lib/apolloClient';
import * as actions from './cart.actions';
import * as types from './cart.types';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';
import { CHECKOUT_CREATE, CHECKOUT_LINES_UPDATE } from '@/graphql/cart.mutations';
import { CHECKOUT_QUERY } from '@/graphql/checkout.queries';

import { DocumentNode } from 'graphql';
const SALEOR_CHANNEL = 'ind_retail';

const getCartItems = (state: RootState): types.CartItem[] => state.cart.items;

const transformCartToLines = (cartItems: types.CartItem[]) => {
  return cartItems.map(item => ({
    quantity: item.quantity,
    variantId: item.id, 
  }));
};
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

function* createCheckoutSaga(): Generator<any, void, any> {
  try {
    const cartItems: types.CartItem[] = yield select(getCartItems);
    
    if (cartItems.length === 0) {
      yield put(actions.createCheckoutFailure('Cart is empty'));
      toast.error('Your cart is empty');
      return;
    }

    const lines = transformCartToLines(cartItems);

    const variables = {
      channel: SALEOR_CHANNEL,
      lines: lines,
    };

    console.log('Creating checkout with variables:', variables);

    const { data } = yield call([apolloClient, 'mutate'], {
      mutation: CHECKOUT_CREATE,
      variables,
    });

    if (data.checkoutCreate.errors && data.checkoutCreate.errors.length > 0) {
      const errorMessage = data.checkoutCreate.errors[0].message;
      yield put(actions.createCheckoutFailure(errorMessage));
      toast.error(`Checkout failed: ${errorMessage}`);
      return;
    }

    const checkout = data.checkoutCreate.checkout;
    yield put(actions.createCheckoutSuccess(checkout));
    
    // Store checkout token in localStorage for persistence
    localStorage.setItem('checkoutToken', checkout.token);
    
    toast.success('Checkout created successfully');
    console.log('Checkout created:', checkout);

  } catch (error: any) {
    console.error('Checkout creation failed:', error);
    yield put(actions.createCheckoutFailure(error.message));
    toast.error('Failed to create checkout');
  }
}
 

function* updateCheckoutLinesSaga(action: ReturnType<typeof actions.updateCheckoutLinesRequest>): Generator<any, void, any> {
  try {
    const { checkoutId, lines } = action.payload;

    const variables = {
      checkoutId: checkoutId, 
      lines: lines.map(line => ({
        quantity: line.quantity,
        variantId: line.variantId,
      })),
    };

    console.log('Updating checkout lines with variables:', variables);

    const { data } = yield call(executeMutation, CHECKOUT_LINES_UPDATE, variables);

    if (data.checkoutLinesUpdate.errors && data.checkoutLinesUpdate.errors.length > 0) {
      const errorMessage = data.checkoutLinesUpdate.errors[0].message;
      yield put(actions.updateCheckoutLinesFailure(errorMessage));
      toast.error(`Failed to update cart: ${errorMessage}`);
      return;
    }

    yield put(actions.updateCheckoutLinesSuccess(data.checkoutLinesUpdate.checkout));
    toast.success('Cart updated successfully');

  } catch (error: any) {
    console.error('Checkout lines update failed:', error);
    yield put(actions.updateCheckoutLinesFailure(error.message));
    toast.error('Failed to update cart');
  }
}


function* syncCartWithCheckoutSaga(): Generator<any, void, any> {
  try {
    const cartItems: types.CartItem[] = yield select(getCartItems);
    const { checkout } = yield select((state: RootState) => state.cart);

    
    if (!checkout || !checkout.id || cartItems.length === 0) {
      return; 
    }

    const lines = transformCartToLines(cartItems);

    const variables = {
      checkoutId: checkout.id, 
      lines,
    };

   const { data } = yield call(executeMutation, CHECKOUT_LINES_UPDATE, variables);

    if (data.checkoutLinesUpdate.errors && data.checkoutLinesUpdate.errors.length > 0) {
      console.warn('Cart sync failed:', data.checkoutLinesUpdate.errors);
      return;
    }

  } catch (error: any) {
    console.error('Cart sync failed:', error);
  }
}


function* fetchCheckoutSaga(action: ReturnType<typeof actions.fetchCheckoutRequest>): Generator<any, void, any> {
  try {
    const checkoutId = action.payload;
    const variables = {
      id: checkoutId,
      languageCode: 'EN' 
    };

    

    const { data } = yield call([apolloClient, 'query'], {
      query: CHECKOUT_QUERY,
      variables: variables, 
      fetchPolicy: 'network-only',
    });

    if (data.checkout) {
      
      yield put(actions.fetchCheckoutSuccess(data.checkout));
    } else {
      yield put(actions.fetchCheckoutFailure('Checkout not found'));
    }

  } catch (error: any) {
    console.error('Cart saga - failed to fetch checkout:', error);
    yield put(actions.fetchCheckoutFailure(error.message));
  }
}

// Root cart saga
export default function* cartSagas() {
  yield takeEvery(types.CREATE_CHECKOUT_REQUEST, createCheckoutSaga);
  yield takeEvery(types.UPDATE_CHECKOUT_LINES_REQUEST, updateCheckoutLinesSaga);
  yield takeEvery('FETCH_CHECKOUT_REQUEST', fetchCheckoutSaga);
  yield watchCartChanges();
}

function* watchCartChanges(): Generator<any, void, any> {
  yield takeEvery(
    [types.ADD_TO_CART, types.REMOVE_FROM_CART, types.UPDATE_CART_QUANTITY],
    syncCartWithCheckoutSaga
  );
}