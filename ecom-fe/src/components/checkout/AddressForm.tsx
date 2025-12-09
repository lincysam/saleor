import React from "react";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StateSelect } from "@/components/checkout/StateSelect";
import { CountryCode } from "@/data/countries";

interface AddressFormProps {
  title: string;
  form: any; // Formik form instance
  sameAsShipping?: boolean;
  onSameAsShippingChange?: (checked: boolean) => void;
  onAddressUpdate?: (addressData: any) => void;
  isBilling?: boolean; 
  fixedCountry?: boolean; // New prop to fix country
}

export const AddressForm: React.FC<AddressFormProps> = ({
  title,
  form,
  sameAsShipping = false,
  onSameAsShippingChange,
  onAddressUpdate,
  isBilling = false,
  fixedCountry = true // Default to true to fix country to India
}) => {

  useEffect(() => {
    if (onAddressUpdate) {
      onAddressUpdate(form.values);
    }
  }, [form.values, onAddressUpdate, sameAsShipping]);

  // Handle same as shipping change
  const handleSameAsShippingChange = (checked: boolean) => {
    if (onSameAsShippingChange) {
      onSameAsShippingChange(checked);
      if (checked && onAddressUpdate) {
        onAddressUpdate(form.values);
      }
    }
  };

  // Set default country to India on component mount
  useEffect(() => {
    if (fixedCountry && !form.values.countryCode) {
      form.setFieldValue('countryCode', 'IN' as CountryCode);
    }
  }, [fixedCountry, form]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {onSameAsShippingChange && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameAsShipping"
                checked={sameAsShipping}
                onCheckedChange={handleSameAsShippingChange}
              />
              <Label htmlFor="sameAsShipping" className="text-sm">
                Same as shipping address
              </Label>
            </div>
          )}
        </div>

        {(!sameAsShipping || !isBilling) && (
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  required
                  value={form.values.firstName}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  required
                  value={form.values.lastName}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="companyName">Company (optional)</Label>
              <Input
                id="companyName"
                name="companyName"
                value={form.values.companyName}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
            </div>

            <div>
              <Label htmlFor="streetAddress1">Street address *</Label>
              <Input
                id="streetAddress1"
                name="streetAddress1"
                required
                value={form.values.streetAddress1}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="House number and street name"
              />
            </div>

            <div>
              <Label htmlFor="streetAddress2">Street address (continue)</Label>
              <Input
                id="streetAddress2"
                name="streetAddress2"
                value={form.values.streetAddress2}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="Apartment, suite, unit, etc. (optional)"
              />
            </div>

            {/* Fixed Country Display */}
            {fixedCountry && (
              <div>
                <Label htmlFor="country">Country *</Label>
                <div className="p-2 border rounded-md bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">India</span>
                    {/* <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                      Fixed
                    </span> */}
                  </div>
                </div>
                <input
                  type="hidden"
                  id="countryCode"
                  name="countryCode"
                  value="IN"
                  onChange={form.handleChange}
                />
              </div>
            )}

            {/* State/Province Selection */}
            {fixedCountry && (
              <StateSelect
                countryCode="IN"
                value={form.values.countryArea || ""}
                onChange={(value) => form.setFieldValue("countryArea", value)}
                label="State"
                id="countryArea"
                required
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  required
                  value={form.values.city}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal code *</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  required
                  value={form.values.postalCode}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.values.phone}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
            </div>
          </div>
        )}

        {/* Show message when same as shipping is checked for billing */}
        {isBilling && sameAsShipping && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-700 text-sm">
              Billing address will be the same as shipping address.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};