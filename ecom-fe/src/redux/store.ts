import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import authReducer from './auth/auth.reducer';
import productReducer from './product/product.reducer';
import cartReducer from './cart/cart.reducer';
import checkoutReducer from './checkout/checkout.reducer';
import authSaga from './auth/auth.saga';
import productSaga from './product/product.saga';
import cartSaga from './cart/cart.saga';
import checkoutSaga from './checkout/checkout.saga';

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
});

function* rootSaga() {
  yield all([
    authSaga(),
    productSaga(),
    cartSaga(),
    checkoutSaga(),
     
  ]);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof rootReducer>;
export default store;
