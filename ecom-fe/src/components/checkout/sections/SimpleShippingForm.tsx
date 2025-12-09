// components/checkout/SimpleShippingForm.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SimpleShippingFormProps {
  onSubmit: (addressData: any) => void;
  isLoading?: boolean;
}

export const SimpleShippingForm: React.FC<SimpleShippingFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    postalCode: '',
    countryCode: 'US',
    phone: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📦 Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="John"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Doe"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="streetAddress1">Street Address *</Label>
            <Input
              id="streetAddress1"
              value={formData.streetAddress1}
              onChange={(e) => handleChange('streetAddress1', e.target.value)}
              placeholder="123 Main St"
              required
              disabled={isLoading}
            />
          </div>

          {/* Apartment/Suite */}
          <div className="space-y-2">
            <Label htmlFor="streetAddress2">Apartment, Suite, etc. (Optional)</Label>
            <Input
              id="streetAddress2"
              value={formData.streetAddress2}
              onChange={(e) => handleChange('streetAddress2', e.target.value)}
              placeholder="Apt 4B"
              disabled={isLoading}
            />
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="New York"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">ZIP / Postal Code *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                placeholder="10001"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="countryCode">Country *</Label>
            <Select
              value={formData.countryCode}
              onValueChange={(value) => handleChange('countryCode', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="IN">India</SelectItem>
                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Saving Address..." : "Save Shipping Address"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};