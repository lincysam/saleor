// Optimized version of UserShippingAddressSection
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateCheckoutShippingAddressRequest } from "@/redux/checkout/checkout.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, MapPin, Edit, Loader2 } from "lucide-react";
import { AddressForm } from "@/components/checkout/AddressForm";
import { normalizePhone } from "./utils/normalizePhone";
import { toast } from "sonner";
import { CountryCode } from "@/data/countries";

export const UserShippingAddressSection = ({ form, defaultShippingAddress }) => {
  const dispatch = useDispatch();
  const { checkout: cartCheckout } = useSelector((s: RootState) => s.cart);
  const { loading } = useSelector((s: RootState) => s.checkout);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [mode, setMode] = useState<"none" | "new" | "edit">("none");
  const [isSaving, setIsSaving] = useState(false);

  const savedAddresses = useMemo(() => defaultShippingAddress ? [defaultShippingAddress] : [], [defaultShippingAddress]);

  useEffect(() => {
    if (defaultShippingAddress && form) {
      setSelectedAddress(defaultShippingAddress.id);
      Object.entries(defaultShippingAddress).forEach(([key, val]) => {
        if (key in form.values) form.setFieldValue(key, val);
      });
      
      // Ensure country code is set to IN (India)
      if (!form.values.countryCode) {
        form.setFieldValue('countryCode', 'IN' as CountryCode);
      }
    }
  }, [defaultShippingAddress, form]);

  const handleSelect = (id: string) => {
    setSelectedAddress(id);

    if (id === "new") {
      setMode("new");
      form.resetForm();
      // Set default country to India for new address
      form.setFieldValue('countryCode', 'IN' as CountryCode);
      return;
    }

    const address = savedAddresses.find(a => a.id === id);
    if (!address) return;

    Object.entries(address).forEach(([key, val]) => {
      if (key in form.values) form.setFieldValue(key, val);
    });

    // Ensure country code is set to IN (India)
    if (!form.values.countryCode) {
      form.setFieldValue('countryCode', 'IN' as CountryCode);
    }

    setMode("none");
  };

  const handleEdit = (id: string, e) => {
    e.stopPropagation();
    setSelectedAddress(id);

    const address = savedAddresses.find(a => a.id === id);
    if (!address) return;

    Object.entries(address).forEach(([key, val]) => {
      if (key in form.values) form.setFieldValue(key, val);
    });

    // Ensure country code is set to IN (India)
    if (!form.values.countryCode) {
      form.setFieldValue('countryCode', 'IN' as CountryCode);
    }

    setMode("edit");
  };

  const handleSave = async () => {
    if (!cartCheckout?.id || !form) return toast.error("Checkout not available");

    setIsSaving(true);
    try {
      const errors = await form.validateForm();
      if (Object.keys(errors).length) {
        form.setTouched(Object.fromEntries(Object.keys(form.values).map(k => [k, true])));
        return toast.error("Please provide valid data");
      }

      const v = form.values;
      dispatch(updateCheckoutShippingAddressRequest({
        checkoutId: cartCheckout.id,
        shippingAddress: {
          firstName: v.firstName || " ",
          lastName: v.lastName || " ",
          streetAddress1: v.streetAddress1,
          city: v.city,
          countryArea: v.countryArea, // This will contain the selected state
          postalCode: v.postalCode,
          country: v.countryCode || "IN", // Fixed to India
          phone: normalizePhone(v.phone),
        },
      }));
      setMode("none");
    } catch (err) {
      toast.error("Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const isFormVisible = mode !== "none";
  const current = savedAddresses.find(a => a.id === selectedAddress);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Shipping address
          </h2>
          {(isSaving || loading) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        {/* ADDRESS LIST */}
        <RadioGroup value={selectedAddress} onValueChange={handleSelect}>
          {savedAddresses.map(addr => (
            <div
              key={addr.id}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors mb-3 group ${
                selectedAddress === addr.id ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <RadioGroupItem value={addr.id} id={`shipping-${addr.id}`} disabled={loading || isSaving} />

              <Label htmlFor={`shipping-${addr.id}`} className="flex-1 cursor-pointer">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{addr.firstName} {addr.lastName}</div>
                    <div className="text-sm text-muted-foreground">{addr.streetAddress1}</div>
                    <div className="text-sm text-muted-foreground">{addr.city}, {addr.countryArea} {addr.postalCode}</div>
                    <div className="text-sm text-muted-foreground">India</div>
                    {addr.phone && <div className="text-sm text-muted-foreground">{addr.phone}</div>}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleEdit(addr.id, e)}
                    className="opacity-0 group-hover:opacity-100"
                    disabled={loading || isSaving}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </Label>
            </div>
          ))}

          {/* ADD NEW */}
          <div
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedAddress === "new" ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <RadioGroupItem value="new" id="shipping-new" disabled={loading || isSaving} />
            <Label htmlFor="shipping-new" className="flex-1 cursor-pointer font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add new address
            </Label>
          </div>
        </RadioGroup>

        {/* FORM */}
        {isFormVisible && (
          <div className="mt-6">
            <AddressForm 
              title={mode === "edit" ? "Edit address" : "New address"} 
              form={form} 
              fixedCountry={true} // Country fixed to India
            />

            <div className="flex gap-3 mt-4">
              <Button onClick={handleSave} className="flex-1" disabled={loading || isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {mode === "edit" ? "Update Address" : "Save Address"}
              </Button>

              <Button variant="outline" onClick={() => setMode("none")} disabled={loading || isSaving}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {!isFormVisible && current && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold mb-2 text-green-800 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Selected Shipping Address
            </h4>
            <div className="text-sm text-green-700">
              <div className="font-medium">{current.firstName} {current.lastName}</div>
              <div>{current.streetAddress1}</div>
              <div>{current.city}, {current.countryArea} {current.postalCode}</div>
              <div>India</div>
              {current.phone && <div>{current.phone}</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};