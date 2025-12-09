
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchProductDetailRequest } from '@/redux/product/product.actions';
import { 
  addToCart, 
  addToWishlist, 
  removeFromWishlist,
  createCheckoutRequest,
  updateCheckoutLinesRequest 
} from '@/redux/cart/cart.actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import AppBreadcrumbs from '@/components/AppBreadcrumbs';
import { formatCurrency } from '@/components/checkout/sections/utils/formatCurrency';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetail, loading, categories } = useSelector((state: RootState) => state.product);
  const { wishlist, checkout, items } = useSelector((state: RootState) => state.cart);

  // State for selected variant
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetailRequest(id));
    }
  }, [dispatch, id]);

  // Set default variant when product data loads
  useEffect(() => {
    if (productDetail?.variants && productDetail.variants.length > 0) {
      setSelectedVariant(productDetail.variants[0]);
    }
  }, [productDetail]);

  if (loading || !productDetail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-muted rounded-lg mb-8" />
          <div className="h-8 bg-muted rounded w-3/4 mb-4" />
          <div className="h-6 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.includes(productDetail.id);

  // Resolve image URLs for assets defined as strings in mock data
  // const assetMap = import.meta.glob('/src/assets/*', { eager: true, as: 'url' }) as Record<string, string>;
  const assetMap = import.meta.glob('/src/assets/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

  const imageSrc = assetMap[productDetail.image] ?? productDetail.image;
  const breadcrumbItems = (() => {
  const items: { label: string; to?: string }[] = [];
  if (productDetail) {
    const cat = categories.find((c) => c.name === productDetail.category);
    if (cat) {
      items.push({ label: cat.name, to: `/category/${cat.id}` });
      const level2 = (cat.subcategories || []).find((s2) => {
        const hasDirect = s2.name === productDetail.subcategory;
        const hasSub = (s2.subcategories || []).some((s3) => s3.name === productDetail.subcategory);
        return hasDirect || hasSub;
      });
      if (level2) {
        items.push({ label: level2.name, to: `/category/${cat.id}/${level2.id}` });
        const level3 = (level2.subcategories || []).find((s3) => s3.name === productDetail.subcategory);
        if (level3) {
          items.push({ label: level3.name, to: `/category/${cat.id}/${level2.id}/${level3.id}` });
        }
      }
    } else {
      items.push({ label: 'Products', to: '/products' });
    }
    // Current page
    items.push({ label: productDetail.name });
  }
  return items;
})();
// In ProductDetail.tsx - SIMPLIFIED handleAddToCart
const handleAddToCart = () => {
  if (!selectedVariant) {
    toast.error('Please select a variant');
    return;
  }

  console.log('Adding to cart - Variant ID:', selectedVariant.id);

  // Just dispatch addToCart - the saga will automatically handle the API call
  dispatch(addToCart({
    id: selectedVariant.id,
    productId: productDetail.id,
    name: productDetail.name,
    price: productDetail.price,
    image: productDetail.image,
    variant: selectedVariant,
    currency: productDetail.currency,
  }));
  
  toast.success('Added to cart!');
};
  
  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(productDetail.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(productDetail.id));
      toast.success('Added to wishlist');
    }
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    // Add to cart with variant ID
    dispatch(addToCart({
      id: selectedVariant.id,
      productId: productDetail.id,
      name: productDetail.name,
      price: productDetail.price,
      image: productDetail.image,
      currency: productDetail.currency,
      // variant: selectedVariant,
    }));
    
    // Then navigate to cart
    navigate('/cart');
  };
  function extractTextFromDescription(description) {
  if (!description) return "";
  try {
    const data = JSON.parse(description);
    if (!data.blocks) return "";
    return data.blocks
      .filter(block => block.data?.text)
      .map(block => block.data.text)
      .join("\n");  // or space if you prefer
  } catch (err) {
    return "";
  }
}
const desc_text = extractTextFromDescription(productDetail.description);

  const currency = productDetail?.currency ?? "USD";
  const price = productDetail?.price ?? 0;
  // const formattedPrice = new Intl.NumberFormat(undefined, {
  //   style: "currency",
  //   currency,
  // }).format(price);
  // const formattedOriginalPrice = productDetail?.originalPrice
  //   ? new Intl.NumberFormat(undefined, {
  //       style: "currency",
  //       currency,
  //     }).format(productDetail.originalPrice)
  //   : null;  

  // Render variant selector if product has multiple variants
  const renderVariantSelector = () => {
    if (!productDetail.variants || productDetail.variants.length <= 1) {
      return null;
    }


    return (
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Select Variant</h3>
        <div className="flex flex-wrap gap-2">
          {productDetail.variants.map((variant: any) => (
            <Button
              key={variant.id}
              variant={selectedVariant?.id === variant.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedVariant(variant)}
            >
              {variant.name || `Variant ${variant.sku}`}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? 'fill-primary text-primary' : 'text-muted'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb - Hidden on mobile */}
        <AppBreadcrumbs items={breadcrumbItems} className="hidden md:block mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Product Image */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              {productDetail.discount && (
                <Badge className="absolute top-4 left-4 z-10 bg-destructive">
                  -{productDetail.discount}% OFF
                </Badge>
              )}
              {/* Wishlist Heart Icon - Top Right */}
              <Button
                size="icon"
                variant="outline"
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background ${isInWishlist ? 'text-destructive' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
              <img
                src={imageSrc}
                alt={productDetail.name}
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                {productDetail.brand}
              </Badge>
              <h1 className="font-bold mb-2 leading-tight" style={{ fontSize: 'var(--text-2xl)' }}>
                {productDetail.name}
              </h1>
              
              {/* Variant Selector */}
              {renderVariantSelector()}
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="flex">{renderStars(productDetail.rating)}</div>
                <span className="font-medium" style={{ fontSize: 'var(--text-base)' }}>
                  {productDetail.rating}
                </span>
                <span className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  ({productDetail.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                <span className="font-bold text-primary" style={{ fontSize: 'var(--text-3xl)' }}>
                  {/* {formattedPrice}  */}
                  {formatCurrency(productDetail.price, currency)} 
                </span>
                 {formatCurrency(productDetail.originalPrice) && ( 
                  <span className="text-muted-foreground line-through" style={{ fontSize: 'var(--text-lg)' }}>
                   {formatCurrency(productDetail.originalPrice, currency)}
                    {/* {productDetail.originalPrice.toFixed(2)} */}
                  </span>
                )}
              </div>

              {/* Selected Variant Info */}
              {selectedVariant && (
                <div className="mb-4">
                  <Badge variant="secondary" className="text-sm">
                    Selected: {selectedVariant.name || `SKU: ${selectedVariant.sku}`}
                  </Badge>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {productDetail.inStock ? (
                  <Badge className="bg-success text-white" style={{ fontSize: 'var(--text-sm)' }}>
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <Button
                  size="lg"
                  className="flex-1 h-12 font-semibold"
                  style={{ fontSize: 'var(--text-base)' }}
                  onClick={handleAddToCart}
                  disabled={!productDetail.inStock || !selectedVariant}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="default"
                  className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  style={{ fontSize: 'var(--text-base)' }}
                  onClick={handleBuyNow}
                  disabled={!productDetail.inStock || !selectedVariant}
                >
                  Buy Now
                </Button>
              </div>
            </div>

              <Separator />

            {/* Description */}
            <div>
              <h2 className="font-semibold mb-2" style={{ fontSize: 'var(--text-lg)' }}>Description</h2>
              <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 'var(--text-base)' }}>{desc_text}</p>
            </div>

            <Separator />

            {/* Features */}
            <div>
              <h2 className="font-semibold mb-2" style={{ fontSize: 'var(--text-lg)' }}>Key Features</h2>
              <ul className="space-y-2">
                {productDetail.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2" style={{ fontSize: 'var(--text-base)' }}>
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="p-4 text-center">
                <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>Free Shipping</p>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>On orders over ₹1000</p>
              </Card>
              <Card className="p-4 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>1 Year Warranty</p>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>Full coverage</p>
              </Card>
              <Card className="p-4 text-center">
                <RotateCcw className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>30 Day Returns</p>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>Money back guarantee</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="font-bold mb-6" style={{ fontSize: 'var(--text-2xl)' }}>Customer Reviews</h2>
          <Card className="p-8 text-center text-muted-foreground">
            <p style={{ fontSize: 'var(--text-base)' }}>Reviews coming soon...</p>
          </Card>
        </div>
          </div>
        </div>
      
    
  );
};

export default ProductDetail;

           
           
           
      