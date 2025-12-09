import { Search, ShoppingCart, User, Menu, Heart, Gift, Package, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/redux/auth/auth.actions';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header = ({ onMobileMenuToggle }: HeaderProps = {}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Clear any pending timeout
      clearTimeout(timeoutId);
      
      // Wait for scroll to settle before updating state
      timeoutId = setTimeout(() => {
        // Use a clear threshold with hysteresis
        if (currentScrollY > 60 && !isScrolled) {
          setIsScrolled(true);
        } else if (currentScrollY < 40 && isScrolled) {
          setIsScrolled(false);
        }
        lastScrollY = currentScrollY;
      }, 50); // 50ms debounce
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isScrolled]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-secondary/95 shadow-header backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className={`relative flex items-center justify-between gap-2 md:gap-4 ${
          isScrolled ? 'h-12 md:h-16' : 'h-14 md:h-16'
        }`}>
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-secondary-foreground hover:text-primary hover:bg-secondary-foreground/5 md:hidden transition-all flex-shrink-0"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo - Fades out on mobile when scrolled */}
          <Link 
            to="/" 
            className={`flex items-center gap-2.5 group transition-opacity duration-200 ${
              isScrolled ? 'md:opacity-100 opacity-0 absolute md:relative pointer-events-none md:pointer-events-auto' : 'opacity-100 relative'
            }`}
          >
            <div className="p-1.5 bg-primary rounded-lg group-hover:scale-105 transition-transform">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-secondary-foreground tracking-tight whitespace-nowrap">ShopHub</span>
          </Link>

          {/* Mobile Search - Fades in when scrolled, takes logo's place */}
          <div 
            className={`md:hidden flex-1 mx-2 transition-opacity duration-200 ${
              isScrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute'
            }`}
          >
            <form onSubmit={handleSearch}>
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full h-9 pr-10 bg-background border-border/50 focus-visible:ring-primary text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1 h-7 px-2.5"
                >
                  <Search className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search for products, brands and more..."
                className="w-full h-11 pr-12 bg-background border-border/50 focus-visible:ring-primary shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1.5 h-8 px-4"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Profile Dropdown - Desktop only */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-secondary-foreground hover:text-primary hover:bg-secondary-foreground/5 transition-all"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/giftcards')}>
                      <Gift className="mr-2 h-4 w-4" />
                      Gift Cards
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-secondary-foreground hover:text-primary hover:bg-secondary-foreground/5 transition-all"
                  onClick={() => navigate('/auth')}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Mobile Profile Icon - Just redirects */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-secondary-foreground hover:text-primary hover:bg-secondary-foreground/5 transition-all"
              onClick={() => navigate(isAuthenticated ? '/account' : '/auth')}
            >
              <User className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-secondary-foreground hover:text-accent hover:bg-secondary-foreground/5 hidden md:inline-flex transition-all"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-secondary-foreground hover:text-primary hover:bg-secondary-foreground/5 relative transition-all"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-xs font-bold text-accent-foreground flex items-center justify-center shadow-md animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Button>

          </div>
        </div>

        {/* Mobile Search - Shows below header when not scrolled */}
        <div className={`md:hidden pb-2.5 pt-1 transition-opacity duration-200 ${
          isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
        }`}>
          <form onSubmit={handleSearch}>
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full h-9 pr-10 bg-background/95 border-border/50 focus-visible:ring-primary text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 h-7 px-2.5"
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};
