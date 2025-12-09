import { Link } from 'react-router-dom';
import { ShoppingCart, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-8 md:mt-12">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <ShoppingCart className="h-5 md:h-6 w-5 md:w-6 text-primary" />
              <span className="text-lg md:text-xl font-bold">ShopHub</span>
            </div>
            <p className="text-xs md:text-sm text-secondary-foreground/80 leading-relaxed">
              Your ultimate shopping destination for electronics, fashion, home goods, and more.
            </p>
            <div className="flex gap-3 md:gap-4 mt-3 md:mt-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-4 md:h-5 w-4 md:w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-4 md:h-5 w-4 md:w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-4 md:h-5 w-4 md:w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Youtube className="h-4 md:h-5 w-4 md:w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Customer Service</h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link to="/help" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Legal</h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-secondary-foreground/60">
          <p>© 2025 ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
