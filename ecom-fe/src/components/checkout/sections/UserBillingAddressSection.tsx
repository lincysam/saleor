
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateCheckoutBillingAddressRequest } from "@/redux/checkout/checkout.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Plus, Edit, Loader2 } from "lucide-react";
import { AddressForm } from "@/components/checkout/AddressForm";
import { toast } from "sonner";
import { normalizePhone } from "./utils/normalizePhone";

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

interface UserBillingAddressSectionProps {
  shippingForm: any;
  billingForm: any;
  defaultBillingAddress:any,
}

export const UserBillingAddressSection: React.FC<UserBillingAddressSectionProps> = ({ 
  shippingForm, 
  billingForm,
  defaultBillingAddress
}) => {
  const dispatch = useDispatch();
  const { checkout: cartCheckout } = useSelector((state: RootState) => state.cart);
  const { loading } = useSelector((state: RootState) => state.checkout);
  
  const [selectedAddress, setSelectedAddress] = useState<string>("same");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const savedAddresses: SavedAddress[] = defaultBillingAddress ? [defaultBillingAddress] : [];

  useEffect(() => {
    if (defaultBillingAddress && billingForm) {
      setSelectedAddress(defaultBillingAddress.id);
      Object.keys(defaultBillingAddress).forEach((key) => {
        if (key in billingForm.values) {
          billingForm.setFieldValue(key, defaultBillingAddress[key as keyof SavedAddress]);
        }
      });
    }
  }, [defaultBillingAddress]);

useEffect(() => {
  if (selectedAddress === "same") {
    const billingAddress = {
      firstName: shippingForm.values.firstName,
      lastName: shippingForm.values.lastName,
      streetAddress1: shippingForm.values.streetAddress1,
      streetAddress2: shippingForm.values.streetAddress2,
      city: shippingForm.values.city,
      countryArea: shippingForm.values.countryArea,
      postalCode: shippingForm.values.postalCode,
      country: shippingForm.values.countryCode || "US",
      phone: shippingForm.values.phone
    };

    // Only save if required fields exist
    if (
      billingAddress.streetAddress1 &&
      billingAddress.city &&
      billingAddress.postalCode
    ) {
      console.log("🟢 Billing synced:", billingAddress);

      dispatch(
        updateCheckoutBillingAddressRequest({
          checkoutId: cartCheckout.id,
          billingAddress
        })
      );
    }
  }
}, [selectedAddress, shippingForm.values]);

const copyShippingToBilling = async () => {
  if (!cartCheckout?.id) return;

  const billingAddress = {
    firstName: shippingForm.values.firstName || '',
    lastName: shippingForm.values.lastName || '',
    streetAddress1: shippingForm.values.streetAddress1 || '',
    streetAddress2: shippingForm.values.streetAddress2 || '',
    city: shippingForm.values.city || '',
    countryArea: shippingForm.values.countryArea || '',
    postalCode: shippingForm.values.postalCode || '',
    country: shippingForm.values.countryCode || 'US', 
    phone: shippingForm.values.phone || '',
  };

  dispatch(updateCheckoutBillingAddressRequest({
    checkoutId: cartCheckout.id,
    billingAddress
  }));
};

  const handleAddressSelect = async (addressId: string) => {
    setSelectedAddress(addressId);
    setEditingAddress(null);
    setShowNewAddressForm(false);
     if (addressId !== "new") {
      const address = savedAddresses.find(addr => addr.id === addressId);
      if (address && cartCheckout?.id) {
        
        Object.keys(address).forEach(key => {
          if (key in billingForm.values) {
            billingForm.setFieldValue(key, address[key as keyof SavedAddress]);
          }
        });
        if (address.streetAddress1 && address.city && address.postalCode) {
          await saveBillingAddressToCheckout(address);
        }
      }
    } else {
      setShowNewAddressForm(true);
      billingForm.resetForm();
    }
  }; 
const saveBillingAddressToCheckout = async (addressData: any) => {
    if (!cartCheckout?.id) return;

    setIsSavingAddress(true);
    try {
      const billingAddress = {
        firstName: addressData.firstName || ' ',
        lastName: addressData.lastName || ' ',
        streetAddress1: addressData.streetAddress1,
        city: addressData.city,
        countryArea: addressData.countryArea,
        postalCode: addressData.postalCode,
        country: addressData.country,
        phone: addressData.phone,
      };

      dispatch(updateCheckoutBillingAddressRequest({
        checkoutId: cartCheckout.id,
        billingAddress
      }));

    } catch (error) {
      
      toast.error('Failed to save billing address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleEditAddress = (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(addressId);
    setSelectedAddress(addressId);
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      Object.keys(address).forEach(key => {
        if (key in billingForm.values) {
          billingForm.setFieldValue(key, address[key as keyof SavedAddress]);
        }
      });
    }
  };

  const handleSaveNewAddress = async () => {
    if (!cartCheckout?.id) return;

    setIsSavingAddress(true);
    
    try {
      // Validate form
      await billingForm.validateForm();
      
      if (billingForm.isValid) {
        const billingAddress = {
          firstName: billingForm.values.firstName || ' ',
          lastName: billingForm.values.lastName || ' ',
          streetAddress1: billingForm.values.streetAddress1,
          city: billingForm.values.city,
          countryArea: billingForm.values.countryArea,
          postalCode: billingForm.values.postalCode,
          country: billingForm.values.countryCode,
          phone: normalizePhone(billingForm.values.phone),
        };

        dispatch(updateCheckoutBillingAddressRequest({
          checkoutId: cartCheckout.id,
          billingAddress
        }));

        setShowNewAddressForm(false);
        setEditingAddress(null);
        
        // Here you would also save to user's address book
        console.log('Saving new billing address to user profile:', billingForm.values);
      } else {
        toast.error('Please fill all required fields');
      }
    } catch (error) {
      console.error('Failed to save billing address:', error);
      toast.error('Failed to save billing address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    setShowNewAddressForm(false);
    
    // Reset to previously selected address
    if (selectedAddress && selectedAddress !== "new") {
      const address = savedAddresses.find(addr => addr.id === selectedAddress);
      if (address) {
        Object.keys(address).forEach(key => {
          if (key in billingForm.values) {
            billingForm.setFieldValue(key, address[key as keyof SavedAddress]);
          }
        });
      }
    } else if (selectedAddress === "same") {
      copyShippingToBilling();
    }
  };

  const isFormVisible = selectedAddress === "new" || showNewAddressForm || editingAddress;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing address
          </h2>
          {(isSavingAddress || loading) && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <RadioGroup value={selectedAddress} onValueChange={handleAddressSelect}>
          {/* Same as shipping address option */}
          <div
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors mb-3 ${
              selectedAddress === "same" ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <RadioGroupItem 
              value="same" 
              id="billing-same" 
              disabled={isSavingAddress || loading}
            />
            <Label htmlFor="billing-same" className="cursor-pointer flex-1">
              <div className="font-semibold">Same as shipping address</div>
              <div className="text-sm text-muted-foreground">
                Use the same address for billing
              </div>
            </Label>
          </div>

          {/* Saved addresses */}
          {savedAddresses.map((address) => (
            <div
              key={address.id}
              className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors mb-3 group ${
                selectedAddress === address.id ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <RadioGroupItem 
                value={address.id} 
                id={`billing-${address.id}`}
                disabled={isSavingAddress || loading}
              />
              <Label htmlFor={`billing-${address.id}`} className="cursor-pointer flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">
                      {address.firstName} {address.lastName}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {address.streetAddress1}
                      {address.streetAddress2 && `, ${address.streetAddress2}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {address.city}, {address.countryArea} {address.postalCode}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleEditAddress(address.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isSavingAddress || loading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </Label>
            </div>
          ))}
          
          {/* Add new address option */}
          <div
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedAddress === "new" ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <RadioGroupItem 
              value="new" 
              id="billing-new"
              disabled={isSavingAddress || loading}
            />
            <Label htmlFor="billing-new" className="cursor-pointer flex-1">
              <div className="font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add new billing address
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Show address form for new addresses or when editing */}
        {isFormVisible && (
          <div className="mt-6">
            <AddressForm
              title={editingAddress ? "Edit billing address" : "New billing address"}
              form={billingForm}
            />
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleSaveNewAddress}
                className="flex-1"
                disabled={isSavingAddress || loading || !billingForm.isValid}
              >
                {isSavingAddress ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  editingAddress ? 'Update Address' : 'Save Address'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isSavingAddress || loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Show selected address summary */}
        {!isFormVisible && selectedAddress && (
          <div className={`mt-4 p-4 rounded-lg border ${
            selectedAddress === "same" ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
          }`}>
            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
              selectedAddress === "same" ? 'text-blue-800' : 'text-green-800'
            }`}>
              <CreditCard className="h-4 w-4" />
              {selectedAddress === "same" ? 'Using Shipping Address' : 'Selected Billing Address'}
            </h4>
            <div className={`text-sm ${
              selectedAddress === "same" ? 'text-blue-700' : 'text-green-700'
            }`}>
              {selectedAddress === "same" ? (
                <>
                  <div className="font-medium">{shippingForm.values.firstName} {shippingForm.values.lastName}</div>
                  <div>{shippingForm.values.streetAddress1}</div>
                  {shippingForm.values.streetAddress2 && <div>{shippingForm.values.streetAddress2}</div>}
                  <div>{shippingForm.values.city}, {shippingForm.values.countryArea} {shippingForm.values.postalCode}</div>
                  {shippingForm.values.phone && <div>{shippingForm.values.phone}</div>}
                </>
              ) : (
                (() => {
                  const address = savedAddresses.find(addr => addr.id === selectedAddress);
                  return address ? (
                    <>
                      <div className="font-medium">{address.firstName} {address.lastName}</div>
                      <div>{address.streetAddress1}</div>
                      {address.streetAddress2 && <div>{address.streetAddress2}</div>}
                      <div>{address.city}, {address.countryArea} {address.postalCode}</div>
                      {address.phone && <div>{address.phone}</div>}
                    </>
                  ) : null;
                })()
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};







