// hooks/useCartSync.ts
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { syncCartFromCheckout } from '@/redux/cart/cart.actions';

// export const useCartSync = () => {
//   const dispatch = useDispatch();
//   const { checkout, items } = useSelector((state: RootState) => state.cart);

//   useEffect(() => {
    
//     if (checkout && checkout.lines && checkout.lines.length > 0 && items.length === 0) {
      
//       dispatch(syncCartFromCheckout(checkout));
//     }
//   }, [checkout, items.length, dispatch]);
// };

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import {
  clearCart,
  fetchCheckoutRequest,
} from "@/redux/cart/cart.actions";

export const useCartSync = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Track previous user
  const prevUserRef = useRef<any>(null);

  useEffect(() => {
    const prevUser = prevUserRef.current;

    // FIRST LOAD (no prev user)
    if (prevUser === null) {
      prevUserRef.current = user;

      if (!user) {
        // Guest user → Stay with localStorage cart (already handled by reducer)
        return;
      }

      // Logged-in user with checkout token → recover checkout
      const token = localStorage.getItem("checkoutToken");
      if (token) {
        dispatch(fetchCheckoutRequest(token));
      }

      return;
    }

    // USER SWITCHED (login or logout)
    if (prevUser?.id !== user?.id) {
      // Clear all old cart/checkout data
      dispatch(clearCart());

      if (user) {
        // Logged-in: restore checkout if token exists
        const token = localStorage.getItem("checkoutToken");

        if (token) {
          dispatch(fetchCheckoutRequest(token));
        }
      }
    }

    prevUserRef.current = user;
  }, [user, dispatch]);
};
