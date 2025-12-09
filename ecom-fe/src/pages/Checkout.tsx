
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { clearCart } from '@/redux/cart/cart.actions';
import { 
  createCheckoutPaymentRequest,
  completeCheckoutRequest,
  fetchCheckoutRequest,
  resetCheckoutOrder
} from '@/redux/checkout/checkout.actions';
import { CheckoutForm } from '@/pages/checkout/CheckoutForm';
import { OrderSummary } from '@/pages/checkout/OrderSummary';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, checkout: cartCheckout } = useSelector((state: RootState) => state.cart);
  const { order, loading } = useSelector((state: RootState) => state.checkout);
  
  const [step, setStep] = useState<'address' | 'shipping' | 'payment'>('address');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

 
  useEffect(() => {
  if (order?.id) {
    const orderId = order.id;
    const total = cartCheckout?.totalPrice || 0;
    const deliveryTime = order?.deliveryTime || "3–5 business days";

    toast.success("Order placed successfully!");
        
    // Navigate first
    navigate('/order-confirmation', {
      state: {
        orderId,
        total,
        deliveryTime,
      }
    });

    // Then clear the cart AND reset checkout order state
    dispatch(clearCart());
    dispatch(resetCheckoutOrder()); // Reset the order state
  }
}, [order, navigate, dispatch, cartCheckout]);

// Also add a check at the beginning of the component
useEffect(() => {
  // Reset checkout state when component mounts
  dispatch(resetCheckoutOrder());
}, [dispatch]);

// Also check if there's an existing order when entering checkout
useEffect(() => {
  // If there's an existing order from previous checkout, reset it
  if (order && !cartCheckout) {
    dispatch(resetCheckoutOrder());
  }
}, [order, cartCheckout, dispatch]);

  // Refresh shipping methods when step changes to "shipping"
  // useEffect(() => {
  //   if (step === 'shipping' && cartCheckout?.id) {
  //     dispatch(fetchCheckoutRequest({ checkoutId: cartCheckout.id }));
  //   }
  // }, [step, cartCheckout, dispatch]);

  // Called by CheckoutForm on "Place Order"
  const handleCompleteOrder = async (paymentData: any) => {
    if (!cartCheckout) {
      toast.error('Checkout not found');
      return;
    }

    setIsPlacingOrder(true);
    try {
      // 1. Create payment
      await dispatch(
        createCheckoutPaymentRequest({
          checkoutId: cartCheckout.id,
          paymentInput: paymentData
        })
      );

      // 2. Complete checkout
      await dispatch(
        completeCheckoutRequest({
          checkoutId: cartCheckout.id
        })
      );

    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const renderProgressSteps = () => (
    <div className="flex items-center justify-center mb-4 md:mb-8 gap-2 md:gap-4">
      {['address', 'shipping', 'payment'].map((stepName, index) => (
        <div key={stepName} className="flex items-center">
          <div className={`flex items-center gap-1.5 md:gap-2 ${
            step === stepName ? 'text-primary' : 
            (['address', 'shipping', 'payment'].indexOf(step) >= index ? 'text-primary' : 'text-muted-foreground')
          }`}>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${
              step === stepName ? 'bg-primary text-primary-foreground' : 
              (['address', 'shipping', 'payment'].indexOf(step) >= index ? 'bg-primary text-primary-foreground' : 'bg-muted')
            }`}>
              {index + 1}
            </div>
            <span className="font-semibold hidden sm:inline text-sm md:text-base capitalize">
              {stepName === 'shipping' ? 'Shipping Method' : stepName === 'address' ? 'Delivery Address' : 'Payment'}
            </span>
          </div>
          {index < 2 && <ChevronRight className="h-4 md:h-5 w-4 md:w-5 text-muted-foreground mx-1 md:mx-2" />}
        </div>
      ))}
    </div>
  );

  if (items.length === 0 || !cartCheckout) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          {renderProgressSteps()}

          <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-2">
              <CheckoutForm 
                step={step}
                onStepChange={setStep}
                onCompleteOrder={handleCompleteOrder}
                isPlacingOrder={isPlacingOrder || loading}
              />
            </div>

            <div className="lg:col-span-1">
              <OrderSummary 
                step={step}
                onStepChange={setStep}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;



