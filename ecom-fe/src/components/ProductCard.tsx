import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/redux/product/product.types';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist, removeFromWishlist } from '@/redux/cart/cart.actions';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';
import { formatCurrency } from './checkout/sections/utils/formatCurrency';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export const ProductCard = ({ product, showAddToCart = true }: ProductCardProps) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const isInWishlist = wishlist.includes(product.id);

  // Resolve image URLs for assets defined as strings in mock data
  const assetMap = import.meta.glob('/src/assets/*', { eager: true, as: 'url' }) as Record<string, string>;
  const imageSrc = assetMap[product.image] ?? product.image;

  // const formattedPrice = new Intl.NumberFormat(undefined, {
  //   style: 'currency',
  //   currency: product.currency,
  // }).format(product.price);

  // const formattedOriginalPrice = product.originalPrice
  //   ? new Intl.NumberFormat(undefined, {
  //       style: 'currency',
  //       currency: product.currency,
  //     }).format(product.originalPrice)
  //   : null;


  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      currency: product.currency,
    }));
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product.id));
      toast.success('Added to wishlist');
    }
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-fade-in bg-card border-border/40">
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {product.discount && (
            <Badge className="bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground font-bold text-sm px-3 py-1.5 shadow-lg">
              -{product.discount}%
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full bg-background/95 backdrop-blur-sm shadow-md hover:bg-background hover:scale-110 transition-all ${
              isInWishlist ? 'text-accent' : 'text-muted-foreground hover:text-accent'
            }`}
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted/40 to-muted/20">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        <div className="p-3 md:p-4 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-success/10 rounded">
              <Star className="h-3 w-3 fill-success text-success" />
              <span className="font-bold text-success" style={{ fontSize: 'var(--text-sm)' }}>{product.rating}</span>
            </div>
            <span className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>({product.reviewCount.toLocaleString()})</span>
          </div>

          <h3 className="font-medium text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors leading-tight" style={{ fontSize: 'var(--text-base)' }}>
            {product.name}
          </h3>

          <p className="text-muted-foreground font-medium" style={{ fontSize: 'var(--text-sm)' }}>{product.brand}</p>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-bold text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
              
              {formatCurrency(product.price)} 
            </span>
            {formatCurrency(product.originalPrice) && ( 
                
              <div className="flex flex-col">
                <span className="text-muted-foreground line-through" style={{ fontSize: 'var(--text-sm)' }}>
                  {formatCurrency(product.originalPrice)}
                
                </span>
              </div>
            )}
          </div>

          {showAddToCart && (
            <Button
              className="w-full shadow-md hover:shadow-lg transition-all font-semibold h-10"
              style={{ fontSize: 'var(--text-base)' }}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
      </Card>
    </Link>
  );
};
