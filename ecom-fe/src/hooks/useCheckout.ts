// hooks/useCheckoutForm.ts
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";

export const useCheckout= () => {
  const { shippingAddress, billingAddress } = useSelector((state: RootState) => state.checkout);

  const shippingAddressForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      streetAddress1: "",
      streetAddress2: "",
      city: "",
      countryCode: "US",
      countryArea: "",
      postalCode: "",
      phone: "",
    },
    validateOnChange: false,   
    validateOnBlur: false,  
    onSubmit: () => {},
  });

  const billingAddressForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      streetAddress1: "",
      streetAddress2: "",
      city: "",
      countryCode: "US",
      countryArea: "",
      postalCode: "",
      phone: "",
    },
    validateOnChange: false,   
    validateOnBlur: false, 
    onSubmit: () => {},
  });

  // Sync form with Redux state
  useEffect(() => {
    if (shippingAddress) {
      shippingAddressForm.setValues({
        firstName: shippingAddress.firstName || '',
        lastName: shippingAddress.lastName || '',
        companyName: shippingAddress.companyName || '',
        streetAddress1: shippingAddress.streetAddress1 || '',
        streetAddress2: shippingAddress.streetAddress2 || '',
        city: shippingAddress.city || '',
        countryCode: shippingAddress.countryCode || 'US',
        countryArea: shippingAddress.countryArea || '',
        postalCode: shippingAddress.postalCode || '',
        phone: shippingAddress.phone || '',
      });
    }
  }, [shippingAddress]);

  useEffect(() => {
    if (billingAddress) {
      billingAddressForm.setValues({
        firstName: billingAddress.firstName || '',
        lastName: billingAddress.lastName || '',
        companyName: billingAddress.companyName || '',
        streetAddress1: billingAddress.streetAddress1 || '',
        streetAddress2: billingAddress.streetAddress2 || '',
        city: billingAddress.city || '',
        countryCode: billingAddress.country || 'US',
        countryArea: billingAddress.countryArea || '',
        postalCode: billingAddress.postalCode || '',
        phone: billingAddress.phone || '',
      });
    }
  }, [billingAddress]);

  return {
    shippingAddressForm,
    billingAddressForm,
  };
};