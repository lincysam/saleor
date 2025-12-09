import { useEffect } from 'react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { 
  fetchProductsRequest, 
  fetchCategoriesRequest, 
  fetchCollectionsRequest 
} from '@/redux/product/product.actions';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Zap, Shield, Flame, Star } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';
import  {extractTextFromDescription}  from '@/components/checkout/sections/utils/formatDescription';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, categories, collections } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchProductsRequest());
    dispatch(fetchCategoriesRequest());
    dispatch(fetchCollectionsRequest());
  }, [dispatch]);

  const dealProducts = products.filter(p => p.discount).slice(0, 4);
  
  // Get flagship smartphones with good discounts
  const flagshipDeals = products.filter(p => 
    (p.subcategory === 'Android Phones' || p.subcategory === 'iPhones') && 
    p.discount && p.discount >= 8
  ).slice(0, 6);

  // Find collections by name or slug - flexible matching
  const bestSellersCollection = useMemo(() => {
    if (!collections.length) return null;
    
    // Try to find by various naming patterns
    return collections.find(c => 
      c.name.toLowerCase().includes('best') || 
      c.name.toLowerCase().includes('seller') ||
      c.slug.toLowerCase().includes('best') ||
      c.slug.toLowerCase().includes('seller')
    ) || collections[0]; // Fallback to first collection
  }, [collections]);

  const limitedDealsCollection = useMemo(() => {
    if (!collections.length) return null;
    
    // Try to find by various naming patterns
    return collections.find(c => 
      c.name.toLowerCase().includes('limited') || 
      c.name.toLowerCase().includes('deal') ||
      c.name.toLowerCase().includes('time') ||
      c.name.toLowerCase().includes('offer') ||
      c.slug.toLowerCase().includes('limited') ||
      c.slug.toLowerCase().includes('deal')
    ) || (collections.length > 1 ? collections[1] : null); // Fallback to second collection if exists
  }, [collections]);



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBanner})` }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <Badge className="mb-3 md:mb-4 text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2 bg-primary">New Arrivals</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fade-in">
            Shop Smart, Live Better
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Discover amazing deals on electronics, fashion, and home goods
          </p>
          <Button 
            size="lg" 
            className="text-sm md:text-lg px-6 md:px-8 animate-scale-in"
            asChild
          >
            <Link to="/products">Shop Now <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-card-hover transition-shadow">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Best Prices</h3>
              <p className="text-muted-foreground">Unbeatable deals on top brands</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-card-hover transition-shadow">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground">Free delivery on orders over ₹1000</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-card-hover transition-shadow">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">100% secure transactions</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {categories.slice(0, 5).map((category) => (
              <Link 
                key={category.id} 
                to={`/category/${category.id}`}
                className="group"
              >
                <Card className="p-4 md:p-6 text-center hover:shadow-card-hover transition-all hover:scale-105">
                  <h3 className="font-semibold text-sm md:text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
                    Explore →
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Sections - Only show if we have collections */}
      {collections.length > 0 && (
        <>
          {/* First Collection */}
          {bestSellersCollection && bestSellersCollection.products.length > 0 && (
            <CollectionSection 
              collection={bestSellersCollection}
              icon={<Star className="h-8 w-8 text-primary" />}
              badgeText="Collection"
              badgeColor="bg-primary/20 text-primary hover:bg-primary/30"
              gradient="from-primary/5 via-background to-primary/5"
            />
          )}
          

          {/* Second Collection */}
          {limitedDealsCollection && limitedDealsCollection.products.length > 0 && (
            <section className="py-8 md:py-12 bg-gradient-to-r from-accent/10 via-background to-accent/10">
              <div className="container mx-auto px-4">
                <Card className="border-2 border-accent/20 bg-gradient-to-r from-background to-accent/5 overflow-hidden">
                  <div className="p-4 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-accent/10">
                          <Flame className="h-8 w-8 text-accent" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <Badge className="bg-accent text-accent-foreground text-sm md:text-lg px-3 md:px-4 py-0.5 md:py-1">
                              Limited Time
                            </Badge>
                            <Badge variant="outline" className="text-xs md:text-base px-2 md:px-3 py-0.5 md:py-1">
                              Ending Soon
                            </Badge>
                          </div>
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                            {limitedDealsCollection.name}
                          </h2>
                          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl">
                            {extractTextFromDescription(limitedDealsCollection.description) || 'Special offers that won\'t last long'}
                          </p>
                        </div>
                      </div>
                      <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap w-full md:w-auto text-sm md:text-base">
                        <Link to={`/collection/${limitedDealsCollection.slug}`}>
                          Shop Deals <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Link>
                      </Button>
                    </div>
                    {loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {[...Array(6)].map((_, i) => (
                          <Card key={i} className="h-80 animate-pulse bg-muted/50" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {limitedDealsCollection.products.slice(0, 6).map((product) => (
                          <ProductCard key={product.id} product={product} showAddToCart={false} />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </section>
          )}
        </>
      )}

      {/* Show message if no collections */}
      {!loading && collections.length === 0 && (
        <section className="py-8 md:py-12 text-center">
          <Card className="p-8 max-w-md mx-auto">
            <p className="text-muted-foreground">No collections available at the moment.</p>
          </Card>
        </section>
      )}

      {/* Flagship Smartphone Deals */}
      {flagshipDeals.length > 0 && (
        <section className="py-8 md:py-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Flagship Smartphones</h2>
                <p className="text-sm md:text-base text-muted-foreground">Premium phones at unbeatable prices</p>
              </div>
              <Button variant="outline" asChild className="w-full md:w-auto text-sm md:text-base">
                <Link to="/category/electronics/smartphones">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {flagshipDeals.map((product) => (
                <ProductCard key={product.id} product={product} showAddToCart={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Today's Best Deals */}
      {dealProducts.length > 0 && (
        <section className="py-8 md:py-12 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Today's Best Deals</h2>
                <p className="text-sm md:text-base text-muted-foreground">Limited time offers - don't miss out!</p>
              </div>
              <Button variant="outline" asChild className="w-full sm:w-auto text-sm md:text-base">
                <Link to="/deals">View All Deals</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {dealProducts.map((product) => (
                <ProductCard key={product.id} product={product} showAddToCart={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Join Our Newsletter</h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Get exclusive deals and updates delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 md:py-3 rounded-md bg-background text-foreground text-sm md:text-base"
            />
            <Button size="lg" className="w-full sm:w-auto">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Collection Section Component
interface CollectionSectionProps {
  collection: any;
  icon: React.ReactNode;
  badgeText: string;
  badgeColor: string;
  gradient: string;
}

const CollectionSection = ({ 
  collection, 
  icon, 
  badgeText, 
  badgeColor,
  gradient 
  
}: CollectionSectionProps) => (

  <section className={`py-8 md:py-12 bg-gradient-to-br ${gradient}`}>
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            {icon}
          </div>
          <div>
            {/* <Badge className={`mb-2 ${badgeColor}`}>
              {badgeText}
            </Badge> */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              {collection.name}
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl">
              {extractTextFromDescription(collection.description)}
               {/* Explore our curated collection of products */}
            </p>
          </div>
        </div>
        <Button size="lg" variant="outline" asChild className="text-sm md:text-base">
          <Link to={`/collection/${collection.slug}`}>
            View All <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {collection.products.slice(0, 4).map((product: any) => (
          <ProductCard key={product.id} product={product} showAddToCart={false} />
        ))}
      </div>
    </div>
  </section>
);

export default Home;