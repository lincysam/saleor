import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchCategoriesRequest } from '@/redux/product/product.actions';
import { logout } from '@/redux/auth/auth.actions';
import { useEffect, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronRight, Menu, ChevronDown, User, Package, Heart, Gift, LogOut, Bell, CreditCard, Zap, Crown, Tag, ShoppingCart, HelpCircle, FileText, Globe, Store, Ticket } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { AllCategoriesView } from './AllCategoriesView';
import { useMemo } from "react";


interface CategoryNavProps {
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export const CategoryNav = ({ mobileOpen = false, onMobileOpenChange }: CategoryNavProps = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state: RootState) => state.product);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [allCategoriesOpen, setAllCategoriesOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    onMobileOpenChange?.(false);
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onMobileOpenChange?.(false);
  };

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesRequest());
    }
  }, [dispatch, categories.length]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev =>
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };
  const topLevelCategories = useMemo(() => {
  if (!categories || categories.length === 0) return [];

  // Gather all children IDs
  const childIds = new Set<string>();
  categories.forEach(cat => {
    cat.subcategories?.forEach(sub => childIds.add(sub.id));
  });

 
  return categories.filter(cat => !childIds.has(cat.id));
}, [categories]);

  // Desktop Navigation
  const DesktopNav = () => (
    <div className="hidden md:block border-b bg-background shadow-sm">
      <div className="container mx-auto px-4">
        <NavigationMenu className="py-2">
          <NavigationMenuList className="flex-wrap gap-1">
            {topLevelCategories.map((category) => (
              <NavigationMenuItem key={category.id}>
                {category.subcategories && category.subcategories.length > 0 ? (
                  <>
                    <NavigationMenuTrigger className="text-sm font-medium hover:bg-accent/50 transition-colors">
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[600px] lg:w-[800px] xl:w-[900px]">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {category.subcategories.map((subcategory) => (
                            <div key={subcategory.id} className="space-y-2">
                              <Link
                                to={`/category/${category.id}/${subcategory.id}`}
                                className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground bg-muted/50"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-semibold">{subcategory.name}</div>
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                              </Link>
                              {subcategory.subcategories && subcategory.subcategories.length > 0 && (
                                <div className="ml-3 space-y-1">
                                  {subcategory.subcategories.map((subSubcategory) => (
                                    <Link
                                      key={subSubcategory.id}
                                      to={`/category/${category.id}/${subcategory.id}/${subSubcategory.id}`}
                                      className="block select-none rounded-md px-3 py-2 text-xs leading-none no-underline outline-none transition-colors hover:bg-accent/70 hover:text-accent-foreground"
                                    >
                                      {subSubcategory.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link
                    to={`/category/${category.id}`}
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {category.name}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );

  // Mobile Navigation Sheet
  const MobileNav = () => (
    <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
      <SheetContent side="left" className="w-[85vw] max-w-sm p-0 flex flex-col">
        {/* User Profile Section */}
        <div className="bg-primary text-primary-foreground px-4 py-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <User className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate">{user?.name || 'User'}</p>
                <p className="text-xs opacity-90 truncate">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <User className="h-6 w-6" />
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleNavigation('/auth')}
              >
                Login & Signup
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1">
          {/* Feature Zones */}
          <div className="border-b">
            <button
              onClick={() => handleNavigation('/supercoin')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <Zap className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">SuperCoin Zone</span>
            </button>
            <button
              onClick={() => handleNavigation('/plus')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <Crown className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">ShopHub Plus Zone</span>
            </button>
          </div>

          {/* All Categories Section */}
          <div className="border-b">
            <button
              onClick={() => setAllCategoriesOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Menu className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">All Categories</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* More Options */}
          <div className="border-b">
            <button
              onClick={() => handleNavigation('/more')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">More on ShopHub</span>
            </button>
            <button
              onClick={() => handleNavigation('/language')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Choose Language</span>
            </button>
            <button
              onClick={() => handleNavigation('/offers')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <Tag className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Offer Zone</span>
            </button>
            <button
              onClick={() => handleNavigation('/sell')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <Store className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Sell on ShopHub</span>
            </button>
          </div>

          {/* User Actions */}
          <div className="border-b">
            <button
              onClick={() => handleNavigation('/orders')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">My Orders</span>
            </button>
            <button
              onClick={() => handleNavigation('/coupons')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <Ticket className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Coupons</span>
            </button>
            <button
              onClick={() => handleNavigation('/cart')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">My Cart</span>
            </button>
            <button
              onClick={() => handleNavigation('/wishlist')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <Heart className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">My Wishlist</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">My Account</span>
              </button>
            )}
            <button
              onClick={() => handleNavigation('/notifications')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">My Notifications</span>
            </button>
          </div>

          {/* Help & Legal */}
          <div className="border-b">
            <button
              onClick={() => handleNavigation('/help')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Help Centre</span>
            </button>
            <button
              onClick={() => handleNavigation('/legal')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Legal</span>
            </button>
          </div>

          {/* Logout Button */}
          {isAuthenticated && (
            <div className="p-4">
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
      <AllCategoriesView 
        open={allCategoriesOpen} 
        onOpenChange={setAllCategoriesOpen}
        categories={topLevelCategories}
      />
    </>
  );
};
