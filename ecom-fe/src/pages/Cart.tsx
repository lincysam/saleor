import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { removeFromCart, updateCartQuantity, clearCart, createCheckoutRequest } from '@/redux/cart/cart.actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCartSync } from '@/hooks/useCartSync';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/components/checkout/sections/utils/formatCurrency';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    items,
    total,
    itemCount,
    checkout,
    loading,
    error,
    } = useSelector((state: RootState) => state.cart);
  const cartCurrency = checkout?.currency || items[0]?.currency || 'INR';

  const [isProceedingToCheckout, setIsProceedingToCheckout] = useState(false);

  useCartSync();

  // 🔥 currency formatter
 

  useEffect(() => {
    if (isProceedingToCheckout && checkout && !loading) {
      navigate('/checkout');
      setIsProceedingToCheckout(false);
    }
  }, [checkout, loading, isProceedingToCheckout, navigate]);

  const handleProceedToCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProceedingToCheckout(true);

    try {
      if (!checkout || checkout.lines.length === 0) {
        dispatch(createCheckoutRequest());
      } else {
        navigate('/checkout');
        setIsProceedingToCheckout(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsProceedingToCheckout(false);
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartQuantity(productId, newQuantity));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Card className="p-6 md:p-12 text-center max-w-md mx-auto">
            <ShoppingBag className="h-12 md:h-16 w-12 md:w-16 text-muted-foreground mx-auto mb-3 md:mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
              Add some products to get started
            </p>
            <Button asChild className="text-sm md:text-base">
              <Link to="/products">Browse Products</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-8 gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
          <Button variant="outline" onClick={handleClearCart} className="text-sm md:text-base w-full sm:w-auto">
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-3 md:p-6">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-semibold text-sm md:text-base hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-lg md:text-xl font-bold text-primary mt-1 md:mt-2">
                      {formatCurrency(item.price, item.currency)}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 md:gap-4">
                    <div className="flex items-center gap-2 order-2 sm:order-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 md:h-10 md:w-10"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 md:h-4 w-3 md:w-4" />
                      </Button>

                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)
                        }
                        className="w-12 md:w-16 text-center text-sm"
                        min="1"
                      />

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 md:h-10 md:w-10"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 md:h-4 w-3 md:w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="order-1 sm:order-2 h-8 w-8 md:h-10 md:w-10"
                      onClick={() => handleRemove(item.productId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-4 md:p-6 sticky top-20 md:top-24">
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Order Summary</h2>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{formatCurrency(total, cartCurrency)}</span>
                </div>

                {/* <div className="flex justify-between text-sm md:text-base">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-success">Free</span>
                </div> */}

                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">{formatCurrency(total * 0.1, cartCurrency)}</span>
                </div>
              </div>

              <Separator className="my-3 md:my-4" />

              <div className="flex justify-between mb-4 md:mb-6">
                <span className="text-base md:text-lg font-bold">Total</span>
                <span className="text-xl md:text-2xl font-bold text-primary">
                  {formatCurrency(total * 1.1, cartCurrency)}
                </span>
              </div>

              <Button
                className="w-full mb-2 md:mb-3 text-sm md:text-base"
                size="lg"
                onClick={handleProceedToCheckout}
                disabled={isProceedingToCheckout || loading}
              >
                {isProceedingToCheckout || loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {loading ? 'Creating Checkout...' : 'Preparing...'}
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>

              <Button variant="outline" className="w-full text-sm md:text-base" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>

              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-muted rounded-md text-xs md:text-sm text-muted-foreground">
                <p>✓ Secure checkout</p>
                <p>✓ Free shipping on orders over ₹1000</p>
                <p>✓ 30-day return policy</p>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;