
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { fetchProductsRequest } from '@/redux/product/product.actions';
import { ProductCard } from '@/components/ProductCard';
import { MobileProductCard } from '@/components/MobileProductCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Star, Check, ArrowUpDown, Search, ChevronDown } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import AppBreadcrumbs from '@/components/AppBreadcrumbs';
import { fetchCheckoutRequest } from '@/redux/cart/cart.actions';

const ProductList = () => {
const dispatch = useDispatch();
const [searchParams] = useSearchParams();
const params = useParams();
const { products, loading, categories } = useSelector((state: RootState) => state.product);

const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
const [selectedRating, setSelectedRating] = useState<number>(0);
const [showPrimeOnly, setShowPrimeOnly] = useState(false);
const [showDealsOnly, setShowDealsOnly] = useState(false);
const [sortBy, setSortBy] = useState('featured');
const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
const [mobileSortOpen, setMobileSortOpen] = useState(false);
const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
const [brandSearchQuery, setBrandSearchQuery] = useState('');
const search = searchParams.get('q');

// Fetch products whenever category or search changes
const priceRanges = [
{ label: 'Under $25', min: 0, max: 25 },
{ label: '$25 to $50', min: 25, max: 50 },
{ label: '$50 to $100', min: 50, max: 100 },
{ label: '$100 to $200', min: 100, max: 200 },
{ label: '$200 & Above', min: 200, max: Infinity },
];

// In your useEffect, ensure you're passing the correct category to the API
useEffect(() => {
  // Use the leaf category for API filtering
  const categoryTarget = params.subSubcategoryId || params.subcategoryId || params.categoryId || null;
  
  const filter: any = {};
  if (categoryTarget) {
    filter.categoryId = categoryTarget;
  }
  if (search) {
    filter.search = search;
  }

  console.log('Fetching products for category:', categoryTarget);
  dispatch(fetchProductsRequest(filter));
}, [params.categoryId, params.subcategoryId, params.subSubcategoryId, search]);


// Then in your filteredProducts, remove category filtering completely:
const filteredProducts = products
  .filter((p) => {
    // Only apply non-category filters
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchesPrice = !selectedPriceRange || (() => {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      return range ? p.price >= range.min && p.price < range.max : true;
    })();
    const matchesRating = selectedRating === 0 || p.rating >= selectedRating;
    const matchesPrime = !showPrimeOnly || p.price < 500;
    const matchesDeals = !showDealsOnly || p.price < 300;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());

    // NO CATEGORY FILTERING - API already handled this
    return matchesBrand && matchesPrice && matchesRating && matchesPrime && matchesDeals && matchesSearch;
  })
.sort((a, b) => {
  switch (sortBy) {
    case 'price-low': return a.price - b.price;
    case 'price-high': return b.price - a.price;
    case 'rating': return b.rating - a.rating;
    default: return 0;
  }
});


const clearAllFilters = () => {
setSelectedPriceRange('');
setSelectedRating(0);
setShowPrimeOnly(false);
setShowDealsOnly(false);
setSelectedBrands([]);
setBrandSearchQuery('');
};

const allBrands = Array.from(new Set(products.map(p => p.brand))).sort();
const filteredBrands = brandSearchQuery
? allBrands.filter(b => b.toLowerCase().includes(brandSearchQuery.toLowerCase()))
: allBrands;

  // Reusable filter content component
  const FilterContent = () => (
    <div className="space-y-3">
      {/* Brand Filter with Search */}
      <Card className="p-3 border-border/50 shadow-sm">
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded transition-colors group">
            <h3 className="font-bold text-sm uppercase tracking-wide">Brand</h3>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 px-2">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Brand"
                  value={brandSearchQuery}
                  onChange={(e) => setBrandSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto space-y-2">
                {filteredBrands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2.5">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }
                      }}
                    />
                    <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer flex-1">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Customer Reviews */}
      <Card className="p-3 border-border/50 shadow-sm">
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded transition-colors group">
            <h3 className="font-bold text-sm uppercase tracking-wide">Customer Reviews</h3>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 px-2">
            <div className="space-y-3">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                  className={`w-full flex items-center gap-2 text-left p-2 rounded-md hover:bg-muted transition-all ${
                    selectedRating === rating ? 'bg-primary/10 text-primary font-semibold' : ''
                  }`}
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating ? 'fill-[#FFA41C] text-[#FFA41C]' : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">& Up</span>
                  {selectedRating === rating && <Check className="h-4 w-4 ml-auto text-primary" />}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Price */}
      <Card className="p-3 border-border/50 shadow-sm">
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded transition-colors group">
            <h3 className="font-bold text-sm uppercase tracking-wide">Price</h3>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 px-2">
            <RadioGroup value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <div className="space-y-2.5">
                {priceRanges.map((range) => (
                  <div key={range.label} className="flex items-center space-x-2.5 p-1.5 rounded-md hover:bg-muted transition-colors">
                    <RadioGroupItem value={range.label} id={range.label} />
                    <Label
                      htmlFor={range.label}
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      {range.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Deals & Discounts */}
      <Card className="p-3 border-border/50 shadow-sm">
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded transition-colors group">
            <h3 className="font-bold text-sm uppercase tracking-wide">Deals & Discounts</h3>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 px-2">
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="deals"
                  checked={showDealsOnly}
                  onCheckedChange={(checked) => setShowDealsOnly(checked as boolean)}
                />
                <Label htmlFor="deals" className="text-sm font-medium cursor-pointer hover:text-primary transition-colors">
                  🔥 Today's Deals
                </Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Eligibility */}
      <Card className="p-3 border-border/50 shadow-sm">
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded transition-colors group">
            <h3 className="font-bold text-sm uppercase tracking-wide">Eligibility</h3>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 px-2">
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="prime"
                  checked={showPrimeOnly}
                  onCheckedChange={(checked) => setShowPrimeOnly(checked as boolean)}
                />
                <Label htmlFor="prime" className="text-sm font-medium cursor-pointer flex items-center gap-1.5 hover:text-primary transition-colors">
                  <span className="text-primary font-bold">★</span>
                  <span className="text-primary font-bold">Premium</span> Eligible
                </Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );

  // Build breadcrumb items for header
  const breadcrumbItems = (() => {
    const items: { label: string; to?: string }[] = [];
    if (search) {
      items.push({ label: 'Search' });
      return items;
    }
    if (!params.categoryId) {
      items.push({ label: 'Products' });
      return items;
    }
    const cat = categories.find(c => c.id === params.categoryId);
    if (cat) {
      items.push({ label: cat.name, to: `/category/${cat.id}` });
      if (params.subcategoryId) {
        const sub2 = (cat.subcategories || []).find(s2 => s2.id === params.subcategoryId);
        if (sub2) {
          items.push({ label: sub2.name, to: `/category/${cat.id}/${sub2.id}` });
          if (params.subSubcategoryId) {
            const sub3 = (sub2.subcategories || []).find(s3 => s3.id === params.subSubcategoryId);
            if (sub3) {
              items.push({ label: sub3.name, to: `/category/${cat.id}/${sub2.id}/${sub3.id}` });
            }
          }
        }
      }
    } else {
      items.push({ label: 'Products' });
    }
    return items;
  })();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb & Title Section */}
        <div className="mb-6">
          {/* Breadcrumb - Hidden on mobile */}
          <AppBreadcrumbs items={breadcrumbItems} className="hidden md:block mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-base text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'result' : 'results'}
              </p>
              {(selectedPriceRange || selectedRating > 0 || showPrimeOnly || showDealsOnly || selectedBrands.length > 0) && (
                <Button
                  variant="link"
                  onClick={clearAllFilters}
                  className="h-auto p-0 text-primary hover:text-primary/80 hidden md:inline-flex"
                >
                  Clear all filters
                </Button>
              )}
            </div>
            {/* Tablet/Desktop Sort Dropdown */}
            <div className="hidden md:block">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] shadow-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mobile Filter and Sort Bar */}
        <div className="md:hidden mb-4 flex gap-3">
          {/* Sort Sheet */}
          <Sheet open={mobileSortOpen} onOpenChange={setMobileSortOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 shadow-sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[400px]">
              <SheetHeader>
                <SheetTitle>Sort By</SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <RadioGroup value={sortBy} onValueChange={(value) => {
                  setSortBy(value);
                  setMobileSortOpen(false);
                }}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted">
                      <RadioGroupItem value="featured" id="sort-featured" />
                      <Label htmlFor="sort-featured" className="text-base font-medium cursor-pointer flex-1">
                        Popularity
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted">
                      <RadioGroupItem value="price-low" id="sort-price-low" />
                      <Label htmlFor="sort-price-low" className="text-base font-medium cursor-pointer flex-1">
                        Price -- Low to High
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted">
                      <RadioGroupItem value="price-high" id="sort-price-high" />
                      <Label htmlFor="sort-price-high" className="text-base font-medium cursor-pointer flex-1">
                        Price -- High to Low
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted">
                      <RadioGroupItem value="rating" id="sort-rating" />
                      <Label htmlFor="sort-rating" className="text-base font-medium cursor-pointer flex-1">
                        Newest First
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </SheetContent>
          </Sheet>

          {/* Filter Sheet */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 shadow-sm relative">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {(selectedPriceRange || selectedRating > 0 || showPrimeOnly || showDealsOnly || selectedBrands.length > 0) && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-bold text-primary-foreground flex items-center justify-center">
                    {[selectedPriceRange, selectedRating > 0, showPrimeOnly, showDealsOnly, selectedBrands.length > 0].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
              <SheetHeader className="sticky top-0 bg-background pb-4 border-b z-10">
                <div className="flex items-center justify-between">
                  <SheetTitle>Filters</SheetTitle>
                  {(selectedPriceRange || selectedRating > 0 || showPrimeOnly || showDealsOnly || selectedBrands.length > 0) && (
                    <Button
                      variant="link"
                      onClick={clearAllFilters}
                      className="text-primary hover:text-primary/80 h-auto p-0"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </SheetHeader>
              <div className="py-6">
                <FilterContent />
              </div>
              <SheetFooter className="sticky bottom-0 bg-background pt-4 border-t">
                <SheetClose asChild>
                  <Button className="w-full" size="lg">
                    Apply
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tablet/Desktop Filters Sidebar */}
          <aside className="hidden md:block md:col-span-1">
            <div className="space-y-3 sticky top-20">
              <FilterContent />
              {/* Clear Filters */}
              {(selectedPriceRange || selectedRating > 0 || showPrimeOnly || showDealsOnly || selectedBrands.length > 0) && (
                <Button
                  variant="outline"
                  className="w-full shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {/* Mobile: Vertical list skeleton */}
                <div className="md:hidden space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse p-3 flex gap-3">
                      <div className="w-32 h-32 bg-muted rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-3/4" />
                      </div>
                    </Card>
                  ))}
                </div>
                {/* Tablet/Desktop: Grid skeleton */}
                <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(9)].map((_, i) => (
                    <Card key={i} className="h-[450px] animate-pulse bg-muted/50" />
                  ))}
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                {/* Mobile: Vertical list with horizontal cards */}
                <div className="md:hidden space-y-3 animate-fade-in">
                  {filteredProducts.map((product) => (
                    <MobileProductCard key={product.id} product={product} />
                  ))}
                </div>
                {/* Tablet/Desktop: Grid layout */}
                <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} showAddToCart={false} />
                  ))}
                </div>
                {filteredProducts.length > 12 && (
                  <div className="mt-8 flex justify-center">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredProducts.length} products
                    </p>
                  </div>
                )}
              </>
            ) : (
              <Card className="p-16 text-center shadow-sm bg-card border-border/50">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <Filter className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No products found</h3>
                  <p className="text-base text-muted-foreground mb-6">
                    We couldn't find any products matching your criteria. Try adjusting your filters.
                  </p>
                  <Button
                    size="lg"
                    variant="default"
                    className="shadow-sm"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
