// // components/checkout/sections/GuestShippingAddressSection.tsx
// import React from "react";
// import { AddressForm } from "@/components/checkout/AddressForm";
// import { useCheckout } from "@/hooks/useCheckout";

// export const GuestShippingAddressSection = () => {
//   const { shippingAddressForm } = useCheckout();

//   return (
//     <AddressForm
//       title="Shipping address"
//       form={shippingAddressForm}
//     />
//   );
// };

// components/checkout/sections/GuestShippingAddressSection.tsx
import React from "react";
import { AddressForm } from "@/components/checkout/AddressForm";

interface GuestShippingAddressSectionProps {
  form: any; // If using Formik: FormikProps<AddressFormValues>
  onAddressUpdate: (addressData: any) => void;
}

export const GuestShippingAddressSection: React.FC<GuestShippingAddressSectionProps> = ({
  form,
  onAddressUpdate
}) => {
  return (
    <AddressForm
      title="Shipping address"
      form={form}
      onAddressUpdate={onAddressUpdate}
    />
  );
};
