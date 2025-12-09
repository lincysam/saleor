// components/checkout/sections/GuestBillingAddressSection.tsx
// import React from "react";
// import { AddressForm } from "@/components/checkout/AddressForm";
// import { useCheckout } from "@/hooks/useCheckout";

// export const GuestBillingAddressSection = () => {
//   const { billingAddressForm } = useCheckout();

//   return (
//     <AddressForm
//       title="Billing address"
//       form={billingAddressForm}
//     />
//   );
// };

// components/checkout/sections/GuestBillingAddressSection.tsx
import React from "react";
import { AddressForm } from "@/components/checkout/AddressForm";

interface GuestBillingAddressSectionProps {
  shippingForm: any;   // You may still need this for copying values
  billingForm: any;
  onAddressUpdate: (addressData: any) => void;
}

export const GuestBillingAddressSection: React.FC<GuestBillingAddressSectionProps> = ({
  shippingForm,
  billingForm,
  onAddressUpdate
}) => {
  return (
    <AddressForm
      title="Billing address"
      form={billingForm}
      onAddressUpdate={onAddressUpdate} // ✔ works
    />
  );
};
