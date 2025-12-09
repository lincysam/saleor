
import * as types from './cart.types';

const loadCartFromStorage = (): types.CartState => {
  try {
    const cart = localStorage.getItem('cart');
    const checkoutToken = localStorage.getItem('checkoutToken');
    const checkoutId = localStorage.getItem('checkoutId');
    
    if (cart) {
      const parsedCart = JSON.parse(cart);
      return {
        items: parsedCart.items || [],
        wishlist: parsedCart.wishlist || [],
        total: parsedCart.total || 0,
        itemCount: parsedCart.itemCount || 0,
        checkout: (checkoutId && checkoutToken) ? {
          id: checkoutId,
          token: checkoutToken,
          lines: [],
          totalPrice: 0,
          subtotalPrice: 0,
          shippingPrice: 0,
          availablePaymentGateways: [],
          availableShippingMethods: [],
          isShippingRequired: true,
          currency: 'INR',
        } : null,
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return {
    items: [],
    wishlist: [],
    total: 0,
    itemCount: 0,
    checkout: null,
    loading: false,
    error: null,
  };
};

const saveCartToStorage = (state: types.CartState) => {
  try {
    const { items, wishlist, total, itemCount } = state;
    localStorage.setItem('cart', JSON.stringify({ items, wishlist, total, itemCount }));
    
    if (state.checkout?.token) {
      localStorage.setItem('checkoutToken', state.checkout.token);
      localStorage.setItem('checkoutId', state.checkout.id);
    } else {
      localStorage.removeItem('checkoutToken');
      localStorage.removeItem('checkoutId');
    }
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

const calculateTotal = (items: types.CartItem[]) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const calculateItemCount = (items: types.CartItem[]) => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

const transformCheckoutData = (checkoutData: any) => {
  if (!checkoutData) return null;
  
  return {
    id: checkoutData.id,        
    token: checkoutData.token,  
    lines: checkoutData.lines || [],
    totalPrice: checkoutData.totalPrice?.gross?.amount || 0,
    subtotalPrice: checkoutData.subtotalPrice?.gross?.amount || 0,
    shippingPrice: checkoutData.shippingPrice?.gross?.amount || 0,
    availablePaymentGateways: checkoutData.availablePaymentGateways || [],
    availableShippingMethods: checkoutData.availableShippingMethods || [],
    isShippingRequired: checkoutData.isShippingRequired !== false,
    currency: checkoutData.totalPrice?.gross?.currency || 'INR',
  };
}

const initialState: types.CartState = loadCartFromStorage();

const cartReducer = (state = initialState, action: any): types.CartState => {
  let newState: types.CartState;

  switch (action.type) {
    case types.ADD_TO_CART: {
      const existingItem = state.items.find(item => item.productId === action.payload.id);
      let newItems;
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.productId === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, productId: action.payload.id, quantity: 1 }];
      }

      newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
      saveCartToStorage(newState);
      return newState;
    }

    case types.REMOVE_FROM_CART: {
      const newItems = state.items.filter(item => item.productId !== action.payload);
      newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
      saveCartToStorage(newState);
      return newState;
    }

    case types.UPDATE_CART_QUANTITY: {
      const newItems = state.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
      saveCartToStorage(newState);
      return newState;
    }

    case types.CLEAR_CART:
      newState = {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
        checkout: null,
      };
      saveCartToStorage(newState);
      localStorage.removeItem('checkoutToken');
      localStorage.removeItem('checkoutId');
      return newState;

    case types.ADD_TO_WISHLIST:
      if (!state.wishlist.includes(action.payload)) {
        newState = {
          ...state,
          wishlist: [...state.wishlist, action.payload],
        };
        saveCartToStorage(newState);
        return newState;
      }
      return state;

    case types.REMOVE_FROM_WISHLIST:
      newState = {
        ...state,
        wishlist: state.wishlist.filter(id => id !== action.payload),
      };
      saveCartToStorage(newState);
      return newState;

    case types.CREATE_CHECKOUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.CREATE_CHECKOUT_SUCCESS:
      const transformedCheckout = transformCheckoutData(action.payload);
      newState = {
        ...state,
        loading: false,
        checkout: transformedCheckout,
        error: null,
      };
      saveCartToStorage(newState);
      return newState;

    case types.CREATE_CHECKOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.UPDATE_CHECKOUT_LINES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.UPDATE_CHECKOUT_LINES_SUCCESS:
      const updatedCheckoutLines = transformCheckoutData(action.payload); // RENAMED
      newState = {
        ...state,
        loading: false,
        checkout: updatedCheckoutLines, 
        error: null,
      };
      saveCartToStorage(newState);
      return newState;

    case types.UPDATE_CHECKOUT_LINES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

   
    case 'SYNC_CART_FROM_CHECKOUT': {
      const checkoutData = action.payload;
      
      if (!checkoutData || !checkoutData.lines || checkoutData.lines.length === 0) {
        return state;
      }

      const syncedItems = checkoutData.lines.map((line: any) => ({
        id: line.variant.id,
        productId: line.variant.id,
        name: line.variant.product.name,
        price: line.variant.pricing.price.gross.amount,
        image: line.variant.product.thumbnail?.url || '',
        quantity: line.quantity,
        variant: {
          id: line.variant.id,
          name: line.variant.product.name,
          sku: line.variant.sku || '',
        }
      }));

      const syncedTotal = checkoutData.totalPrice?.gross?.amount || 0;
      const syncedItemCount = checkoutData.lines.reduce((sum: number, line: any) => sum + line.quantity, 0);

      newState = {
        ...state,
        items: syncedItems,
        total: syncedTotal,
        itemCount: syncedItemCount,
        checkout: transformCheckoutData(checkoutData),
      };
      
      saveCartToStorage(newState);
      return newState;
    }

  
case 'FETCH_CHECKOUT_REQUEST':
  return {
    ...state,
    loading: true,
    error: null,
  };

case 'FETCH_CHECKOUT_SUCCESS': {
  const fetchedCheckoutData = transformCheckoutData(action.payload);
  console.log('Cart reducer - updating checkout with fetched data:', fetchedCheckoutData);
  newState = {
    ...state,
    loading: false,
    checkout: fetchedCheckoutData,
    error: null,
  };
  saveCartToStorage(newState);
  return newState;
}

case 'FETCH_CHECKOUT_FAILURE':
  return {
    ...state,
    loading: false,
    error: action.payload,
  };

case 'UPDATE_CART_CHECKOUT': {
  const updatedCheckoutData = transformCheckoutData(action.payload);
  newState = {
    ...state,
    checkout: updatedCheckoutData,
  };
  saveCartToStorage(newState);
  return newState;
}

    default:
      return state;
  }
};

export default cartReducer;