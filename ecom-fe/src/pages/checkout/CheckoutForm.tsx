import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  updateCheckoutShippingAddressRequest,
  updateCheckoutEmailRequest,
  updateCheckoutBillingAddressRequest,
  updateCheckoutShippingMethodRequest,
} from "@/redux/checkout/checkout.actions";
import { Contact } from "@/components/checkout/sections/Contact";
import { DeliveryMethods } from "@/components/checkout/sections/DeliveryMethods";
import { PaymentSection } from "@/components/checkout/sections/PaymentSection";
import { UserShippingAddressSection } from "@/components/checkout/sections/UserShippingAddressSection";
import { UserBillingAddressSection } from "@/components/checkout/sections/UserBillingAddressSection";
import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SavedAddress {
  id: string;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  country: string;
  countryArea?: string;
  postalCode: string;
  phone?: string;
  isDefault?: boolean;
}

interface CheckoutFormProps {
  step: "address" | "shipping" | "payment";
  onStepChange: (step: "address" | "shipping" | "payment") => void;
  onCompleteOrder: (paymentData: any) => void;
  isPlacingOrder: boolean;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  step,
  onStepChange,
  onCompleteOrder,
  isPlacingOrder,
}) => {
  const dispatch = useDispatch();
  const { checkout: cartCheckout } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    shippingAddress,
    billingAddress,
    email,
    shippingMethod,
    loading,
    error,
    updatingShippingMethod,
  } = useSelector((state: RootState) => state.checkout);

  const { shippingAddressForm, billingAddressForm } = useCheckout();
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const checkoutId = cartCheckout?.id;

  const [defaultShippingAddress, setDefaultShippingAddress] = useState<
    SavedAddress | undefined
  >(undefined);
  const [defaultBillingAddress, setDefaultBillingAddress] = useState<
    SavedAddress | undefined
  >(undefined);

    const isShippingAddressFilled =
    !!shippingAddressForm &&
    !!shippingAddressForm.values.streetAddress1 &&
    !!shippingAddressForm.values.city &&
    !!shippingAddressForm.values.countryCode &&
    !!shippingAddressForm.values.postalCode;

  const isBillingAddressFilled =
    !!billingAddressForm &&
    !!billingAddressForm.values.streetAddress1 &&
    !!billingAddressForm.values.city &&
    !!billingAddressForm.values.countryCode &&
    !!billingAddressForm.values.postalCode;

  const isAddressFilled = isShippingAddressFilled && isBillingAddressFilled;


  useEffect(() => {
    if (shippingAddressForm && billingAddressForm) {
      // Reserved for any future side effects related to forms
    }
  }, [shippingAddressForm, billingAddressForm]);

  const handleShippingAddressUpdate = (addressData: any) => {
    if (checkoutId) {
      dispatch(
        updateCheckoutShippingAddressRequest({
          checkoutId,
          shippingAddress: addressData,
        })
      );
    }
  };

  const handleBillingAddressUpdate = (addressData: any) => {
    if (checkoutId) {
      dispatch(
        updateCheckoutBillingAddressRequest({
          checkoutId,
          billingAddress: addressData,
        })
      );
    }
  };

  const handleEmailUpdate = (email: string) => {
    if (checkoutId) {
      dispatch(
        updateCheckoutEmailRequest({
          checkoutId,
          email,
        })
      );
    }
  };

  const handleShippingMethodUpdate = (shippingMethodId: string) => {
    if (!checkoutId || updatingShippingMethod) {
      return;
    }

    dispatch(
      updateCheckoutShippingMethodRequest({
        checkoutId,
        shippingMethodId,
      })
    );
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);

    try {
      const shippingErrors = await shippingAddressForm.validateForm();
      const billingErrors = await billingAddressForm.validateForm();

      if (Object.keys(shippingErrors).length > 0 || Object.keys(billingErrors).length > 0) {
        toast.error("Please correct the highlighted fields.");
        setIsSavingAddress(false);
        return;
      }

      handleShippingAddressUpdate({
        firstName: shippingAddressForm.values.firstName || " ",
        lastName: shippingAddressForm.values.lastName || " ",
        streetAddress1: shippingAddressForm.values.streetAddress1,
        city: shippingAddressForm.values.city,
        countryArea: shippingAddressForm.values.countryArea,
        postalCode: shippingAddressForm.values.postalCode,
        country: shippingAddressForm.values.countryCode,
        phone: shippingAddressForm.values.phone,
      });

      handleBillingAddressUpdate({
        firstName: billingAddressForm.values.firstName || " ",
        lastName: billingAddressForm.values.lastName || " ",
        streetAddress1: billingAddressForm.values.streetAddress1,
        city: billingAddressForm.values.city,
        countryArea: billingAddressForm.values.countryArea,
        postalCode: billingAddressForm.values.postalCode,
        country: billingAddressForm.values.countryCode,
        phone: billingAddressForm.values.phone,
      });

      onStepChange("shipping");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error("Please check your address information");
    } finally {
      setIsSavingAddress(false);
    }
  };

  if (!checkoutId) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading checkout...</p>
      </div>
    );
  }

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-end">
      <div className="flex w-full flex-col rounded">
        {step === "address" && (
          <form onSubmit={handleAddressSubmit}>
            <Contact
              onEmailUpdate={handleEmailUpdate}
              email={email}
              loading={loading}
              onUserAddressesFetched={(userData) => {
                setDefaultShippingAddress(userData.defaultShippingAddress);
                setDefaultBillingAddress(userData.defaultBillingAddress);

                if (userData.defaultShippingAddress) {
                  Object.keys(userData.defaultShippingAddress).forEach((key) => {
                    if (key in shippingAddressForm.values) {
                      shippingAddressForm.setFieldValue(
                        key,
                        userData.defaultShippingAddress[key]
                      );
                    }
                  });
                }
                if (userData.defaultBillingAddress) {
                  Object.keys(userData.defaultBillingAddress).forEach((key) => {
                    if (key in billingAddressForm.values) {
                      billingAddressForm.setFieldValue(
                        key,
                        userData.defaultBillingAddress[key]
                      );
                    }
                  });
                }
              }}
            />

            {cartCheckout?.isShippingRequired && (
              <div className="space-y-6 mt-6">
                <UserShippingAddressSection
                  form={shippingAddressForm}
                  defaultShippingAddress={defaultShippingAddress}
                />

                <UserBillingAddressSection
                  shippingForm={shippingAddressForm}
                  billingForm={billingAddressForm}
                  defaultBillingAddress={defaultBillingAddress}
                />
              </div>
            )}

            <div className="mt-6">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!user || isSavingAddress || loading || !isAddressFilled}
              >
                {isSavingAddress ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving Address...
                  </>
                ) : (
                  "Continue to Shipping Method"
                )}
              </Button>

            </div>
          </form>
        )}

        {step === "shipping" && (
          <DeliveryMethods
            onShippingMethodUpdate={handleShippingMethodUpdate}
            selectedShippingMethod={shippingMethod?.id}
            isUpdating={updatingShippingMethod}
            onBackToAddress={() => onStepChange("address")}
            onContinueToPayment={() => {
              onStepChange("payment");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {step === "payment" && (
          <PaymentSection
            onCompleteOrder={onCompleteOrder}
            isSubmitting={isPlacingOrder}
            checkoutId={checkoutId}
            onBackToShipping={() => onStepChange("shipping")}
            shippingMethod={shippingMethod}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};
