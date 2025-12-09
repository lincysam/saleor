import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { removeFromWishlist, addToCart } from '@/redux/cart/cart.actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const products = useSelector((state: RootState) => state.product.products);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product: typeof products[0]) => {
    dispatch(addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }));
    toast.success('Added to cart!');
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <Card className="p-12 text-center max-w-md mx-auto">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love for later
            </p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlistProducts.length})</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <div className="relative">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm text-destructive"
                  onClick={() => handleRemove(product.id)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>

              <div className="p-4 space-y-2">
                <Link
                  to={`/product/${product.id}`}
                  className="font-semibold line-clamp-2 hover:text-primary transition-colors"
                >
                  {product.name}
                </Link>

                <p className="text-sm text-muted-foreground">{product.brand}</p>

                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
