// components/checkout/OrderSummary.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { formatCurrency } from '@/components/checkout/sections/utils/formatCurrency';

interface OrderSummaryProps {
  step: 'address' | 'shipping' | 'payment';
  onStepChange: (step: 'address' | 'shipping' | 'payment') => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ step, onStepChange }) => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { shippingMethod } = useSelector((state: RootState) => state.checkout);

  const shippingCost = shippingMethod?.price?.amount || 0;
  const tax = total * 0.1;
  const finalTotal = total + tax + shippingCost;

  const handleStepNavigation = (targetStep: 'address' | 'shipping') => {
    onStepChange(targetStep);
  };

  return (
    <Card className="p-4 md:p-6 sticky top-20 md:top-24">
      <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Order Summary</h3>

      <div className="space-y-2 md:space-y-3 mb-3 md:mb-4 max-h-52 md:max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2 md:gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 md:w-16 h-12 md:h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium line-clamp-2">{item.name}</p>
              <p className="text-xs md:text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-sm md:text-base">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-3 md:my-4" />

      <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(total)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {!shippingMethod
              ? '--'
              : shippingCost === 0
              ? 'FREE'
              : formatCurrency(shippingCost)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (GST)</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
      </div>

      <Separator className="my-3 md:my-4" />

      <div className="flex justify-between text-base md:text-lg font-bold">
        <span>Total Amount</span>
        <span className="text-primary">{formatCurrency(finalTotal)}</span>
      </div>

      {shippingMethod && (
        <div className="mt-3 p-3 bg-muted rounded-md">
          <p className="text-sm font-medium">Shipping Method:</p>
          <p className="text-sm text-muted-foreground">{shippingMethod.name}</p>
        </div>
      )}

      <div className="mt-4 space-y-2 lg:hidden">
        {step === 'shipping' && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleStepNavigation('address')}
          >
            Back to Address
          </Button>
        )}
        {step === 'payment' && (
          <>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleStepNavigation('address')}
            >
              Back to Address
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleStepNavigation('shipping')}
            >
              Back to Shipping
            </Button>
          </>
        )}
      </div>

      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-success/10 rounded-md text-xs md:text-sm">
        <p className="flex items-center gap-2 text-success font-medium">
          <Shield className="h-3.5 md:h-4 w-3.5 md:w-4" />
          Safe and Secure Payments
        </p>
      </div>
    </Card>
  );
};
