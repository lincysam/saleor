import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Wallet, Shield, Loader2 } from "lucide-react";

interface PaymentSectionProps {
  onCompleteOrder: (paymentData: any) => void;
  isSubmitting: boolean;
  checkoutId: string;
  onBackToShipping: () => void;
  shippingMethod?: any;
  loading?: boolean;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ 
  onCompleteOrder, 
  isSubmitting,
  checkoutId,
  onBackToShipping,
  shippingMethod,
  loading = false
}) => {
  // Set Cash on Delivery as the default payment method
  const [paymentMethod, setPaymentMethod] = React.useState("cod");
  const [cardData, setCardData] = React.useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [upiId, setUpiId] = React.useState("");

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    let paymentInput;
    
    switch (paymentMethod) {
      case 'card':
        paymentInput = {
          gateway: 'mirumee.payments.dummy',
          amount: 100,
          token: 'dummy-token-' + Date.now(),
        };
        break;
      case 'upi':
        paymentInput = {
          gateway: 'mirumee.payments.dummy',
          amount: 100,
          token: upiId || 'upi-dummy-token',
        };
        break;
      case 'cod':
        paymentInput = {
          gateway: 'mirumee.payments.dummy',
          amount: 100,
          token: 'cod-token',
        };
        break;
      default:
        return;
    }

    onCompleteOrder(paymentInput);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
          <Shield className="h-5 md:h-6 w-5 md:w-6" />
          Payment Options
        </h2>
        
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          {/* Card Payment Option (commented out) */}
          {/* <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors mb-3 ${
            paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'
          }`}>
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
              <CreditCard className="h-5 w-5" />
              <div>
                <div className="font-semibold">Credit / Debit Card</div>
                <div className="text-sm text-muted-foreground">Visa, Mastercard, Rupay and more</div>
              </div>
            </Label>
          </div> */}

          {/* UPI Payment Option (commented out) */}
          {/* <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors mb-3 ${
            paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border'
          }`}>
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
              <Smartphone className="h-5 w-5" />
              <div>
                <div className="font-semibold">UPI</div>
                <div className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm & more</div>
              </div>
            </Label>
          </div> */}

          {/* Cash on Delivery Option - Pre-selected */}
          <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'
          }`}>
            <RadioGroupItem value="cod" id="cod" checked={paymentMethod === 'cod'} />
            <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
              <Wallet className="h-5 w-5" />
              <div>
                <div className="font-semibold">Cash on Delivery</div>
                <div className="text-sm text-muted-foreground">Pay when you receive</div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Card Input Fields (commented out) */}
        {/* {paymentMethod === 'card' && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => handleCardInputChange('number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cardName">Name on Card *</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardData.name}
                onChange={(e) => handleCardInputChange('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Valid Through *</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                />
              </div>
            </div>
          </div>
        )} */}

        {/* UPI Input Field (commented out) */}
        {/* {paymentMethod === 'upi' && (
          <div className="pt-4 border-t">
            <Label htmlFor="upiId">UPI ID *</Label>
            <Input
              id="upiId"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="mt-2"
            />
          </div>
        )} */}

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-3 md:pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBackToShipping} 
            className="flex-1 text-sm md:text-base"
            disabled={loading}
          >
            Back to Shipping
          </Button>
          <Button 
            type="button"
            className="flex-1 text-sm md:text-base" 
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || !shippingMethod || loading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Placing Order...
              </>
            ) : (
              'Place Order'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};