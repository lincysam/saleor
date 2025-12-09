import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchShippingMethodsRequest } from "@/redux/checkout/checkout.actions";

interface DeliveryMethodsProps {
  collapsed?: boolean;
  onShippingMethodUpdate: (shippingMethodId: string) => void;
  selectedShippingMethod?: string;
  isUpdating?: boolean;
  onBackToAddress: () => void;
  onContinueToPayment: () => void;
}

export const DeliveryMethods: React.FC<DeliveryMethodsProps> = ({ 
  collapsed = false,      // now unused visually, but kept for compatibility
  onShippingMethodUpdate,
  selectedShippingMethod,
  isUpdating = false,     // unused here but kept for type compatibility
  onBackToAddress,
  onContinueToPayment,
}) => {
  const dispatch = useDispatch();
  const { checkout: cartCheckout } = useSelector((state: RootState) => state.cart);
  const { 
    availableShippingMethods, 
    loading,
    error 
  } = useSelector((state: RootState) => state.checkout);

  const checkoutId = cartCheckout?.id;

  const [hasFetchedShippingMethods, setHasFetchedShippingMethods] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [localSelectedMethod, setLocalSelectedMethod] = useState<string>(selectedShippingMethod || "");
  const [autoSelected, setAutoSelected] = useState(false);

  // Keep local state in sync with prop (in case parent sets it)
  useEffect(() => {
    if (selectedShippingMethod) {
      setLocalSelectedMethod(selectedShippingMethod);
    }
  }, [selectedShippingMethod]);

  // Fetch shipping methods once when checkoutId is available
  useEffect(() => {
    if (checkoutId && !hasFetchedShippingMethods && !hasAttemptedFetch) {
      dispatch(fetchShippingMethodsRequest(checkoutId));
      setHasAttemptedFetch(true);
      setHasFetchedShippingMethods(true);
    }
  }, [checkoutId, hasFetchedShippingMethods, hasAttemptedFetch, dispatch]);

  // Reset fetch state when checkoutId changes
  useEffect(() => {
    if (checkoutId) {
      setHasFetchedShippingMethods(false);
      setHasAttemptedFetch(false);
      setAutoSelected(false);
    }
  }, [checkoutId]);

  // Normalize shipping methods array
  const shippingMethodsToDisplay = Array.isArray(availableShippingMethods) 
    ? availableShippingMethods 
    : [];

  // auto-select a random shipping method and move to payment
  useEffect(() => {
    if (
      !autoSelected &&
      !loading &&
      !error &&
      checkoutId &&
      shippingMethodsToDisplay.length > 0
    ) {
      // pick a random method
      const randomIndex = Math.floor(Math.random() * shippingMethodsToDisplay.length);
      const chosenMethod = shippingMethodsToDisplay[randomIndex];

      if (chosenMethod?.id) {
        setLocalSelectedMethod(chosenMethod.id);
        onShippingMethodUpdate(chosenMethod.id); // call API / update store
        setAutoSelected(true);

        // Immediately go to payment step
        onContinueToPayment();
      }
    }
  }, [
    autoSelected,
    loading,
    error,
    checkoutId,
    shippingMethodsToDisplay,
    onShippingMethodUpdate,
    onContinueToPayment,
  ]);

  return null;
};
