import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || 'N/A';
  const total = location.state?.total || 0;
  const deliveryTime = location.state?.deliveryTime || "3–5 business days";


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
console.log("Order ID:", orderId);
console.log("Total:", total);
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
              <p className="text-muted-foreground text-lg">
                Thank you for shopping with us
              </p>
            </div>

            <div className="bg-muted rounded-lg p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
             
                  <p className="text-lg">{orderId}</p>
                </div>
               
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-lg">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-muted-foreground">You will receive an email confirmation shortly</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-muted-foreground">Your order is being prepared for shipment</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-muted-foreground">Expected delivery in {deliveryTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8">
              <p className="text-sm font-medium mb-2">Order Updates</p>
              <p className="text-sm text-muted-foreground">
                Track your order status and get real-time updates via email and SMS
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild variant="outline" size="lg">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild size="lg" disabled>
                  <span className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                    <Package className="h-4 w-4" />
                    Track Order
                  </span>
                </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
