import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/redux/product/product.types';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '@/redux/cart/cart.actions';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';

interface MobileProductCardProps {
  product: Product;
}

export const MobileProductCard = ({ product }: MobileProductCardProps) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const isInWishlist = wishlist.includes(product.id);

  // Resolve image URLs for assets defined as strings in mock data
  const assetMap = import.meta.glob('/src/assets/*', { eager: true, as: 'url' }) as Record<string, string>;
  const imageSrc = assetMap[product.image] ?? product.image;

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

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="flex gap-3 p-2.5 hover:shadow-md transition-shadow border-border/40 bg-card">
        {/* Product Image */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            className="w-full h-full object-cover rounded"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-1 right-1 h-7 w-7 rounded-full bg-background/95 backdrop-blur-sm shadow-sm hover:bg-background ${
              isInWishlist ? 'text-accent' : 'text-muted-foreground hover:text-accent'
            }`}
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-3.5 w-3.5 ${isInWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Product Name */}
          <h3 className="font-medium text-foreground line-clamp-2 leading-tight mb-1" style={{ fontSize: 'var(--text-base)' }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-success/10 rounded">
              <span className="font-bold text-success" style={{ fontSize: 'var(--text-sm)' }}>{product.rating}</span>
              <Star className="h-2.5 w-2.5 fill-success text-success" />
            </div>
            <span className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-success">
                    {discountPercent}% off
                  </span>
                </>
              )}
            </div>

            {/* Delivery & Offer Info */}
            {product.discount && (
              <p className="text-success font-medium" style={{ fontSize: 'var(--text-xs)' }}>
                🔥 Limited time offer
              </p>
            )}
            {product.inStock ? (
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                Free delivery
              </p>
            ) : (
              <p className="text-destructive font-medium" style={{ fontSize: 'var(--text-xs)' }}>
                Out of stock
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
