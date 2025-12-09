# ShopHub - E-Commerce Platform

A complete, responsive e-commerce web application inspired by Amazon, built with React, Redux Saga, and modern design patterns.

## 🚀 Features

### Core Functionality
- **Multi-level Category Navigation**: Browse from main categories to nested subcategories
- **Product Catalog**: View products with images, pricing, ratings, and reviews
- **Search & Filtering**: Search products and filter by price, brand, and category
- **Shopping Cart**: Add, remove, and update product quantities
- **Wishlist**: Save favorite products for later
- **Authentication**: Login, signup, and password reset flows
- **Product Details**: Detailed product pages with features, reviews, and images
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile

### User Experience
- Beautiful Amazon-inspired UI with smooth animations
- Professional product photography and clean layouts
- Sticky header with search and cart
- Category navigation with dropdown menus
- Deal highlights and featured products
- Order summary with tax calculations

### Technical Implementation
- **Redux Saga**: Complete state management with saga middleware
- **Axios**: Ready for Django backend API integration
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern design system with custom tokens
- **React Router**: Multi-page navigation with protected routes

## 📁 Project Structure

```
src/
├── redux/
│   ├── store.ts                 # Redux store configuration
│   ├── auth/                    # Authentication state
│   │   ├── auth.types.tsx
│   │   ├── auth.actions.tsx
│   │   ├── auth.reducer.tsx
│   │   └── auth.saga.tsx
│   ├── product/                 # Product state
│   │   ├── product.types.tsx
│   │   ├── product.actions.tsx
│   │   ├── product.reducer.tsx
│   │   └── product.saga.tsx
│   └── cart/                    # Cart & Wishlist state
│       ├── cart.types.tsx
│       ├── cart.actions.tsx
│       ├── cart.reducer.tsx
│       └── cart.saga.tsx
├── components/
│   ├── Header.tsx               # Main navigation header
│   ├── CategoryNav.tsx          # Category navigation
│   ├── ProductCard.tsx          # Product display card
│   ├── Footer.tsx               # Site footer
│   └── ui/                      # Shadcn UI components
├── pages/
│   ├── Home.tsx                 # Homepage with hero & featured products
│   ├── ProductList.tsx          # Product listing with filters
│   ├── ProductDetail.tsx        # Individual product page
│   ├── Cart.tsx                 # Shopping cart
│   ├── Wishlist.tsx             # Saved products
│   └── Auth.tsx                 # Login/Signup
├── data/
│   └── mockData.ts              # Mock products and categories
└── assets/                      # Product images and hero banners
```

## 🎨 Design System

The application uses a comprehensive design system defined in `src/index.css` and `tailwind.config.ts`:

- **Primary Color**: Amazon orange (#FF9900)
- **Secondary Color**: Dark navy for headers (#131921)
- **Typography**: Inter font family
- **Custom Shadows**: Card shadows with hover effects
- **Animations**: Fade-in, slide-up, and scale-in animations

## 🔧 Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Redux Toolkit**: State management
- **Redux Saga**: Side effect management
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: High-quality component library
- **Lucide React**: Beautiful icons

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 🔌 Backend Integration

The application is structured to integrate with a Django backend. All Redux Sagas are ready for API integration:

### Example API Endpoints (to be implemented in Django):

```
POST   /api/auth/login           # User login
POST   /api/auth/signup          # User registration
POST   /api/auth/password-reset  # Password reset
GET    /api/products             # Get all products
GET    /api/products/:id         # Get product details
GET    /api/categories           # Get categories
GET    /api/products/search      # Search products
POST   /api/orders               # Create order
GET    /api/orders/:id           # Get order details
```

### Connecting to Django Backend:

1. Update API base URLs in saga files:
   - `src/redux/auth/auth.saga.tsx`
   - `src/redux/product/product.saga.tsx`
   - `src/redux/cart/cart.saga.tsx`

2. Replace mock data calls with actual Axios API calls

3. Add authentication token to Axios headers:
```typescript
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## 📱 Features Overview

### Home Page
- Hero banner with call-to-action
- Feature highlights (pricing, shipping, security)
- Category tiles
- Today's best deals section
- Featured products grid
- Newsletter subscription

### Product Listing
- Advanced filtering (price, brand, category)
- Sorting options (featured, price, rating)
- Responsive product grid
- Real-time filter updates

### Product Detail
- High-quality product images
- Detailed specifications
- Customer ratings and reviews
- Add to cart and wishlist
- Shipping and warranty information

### Shopping Cart
- Quantity adjustments
- Price calculations with tax
- Order summary
- Continue shopping option
- Secure checkout flow

### Authentication
- Login with email/password
- User registration
- Password reset functionality
- Form validation
- Protected routes

## 🎯 Future Enhancements

- [ ] User profile management
- [ ] Order history and tracking
- [ ] Product reviews and ratings system
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Social sharing
- [ ] Multi-language support
- [ ] Dark mode toggle

## 📄 License

This project was built with Lovable.dev

## 🤝 Contributing

This is a demo e-commerce platform. Feel free to fork and customize for your needs!

## 📞 Support

For issues and questions, please refer to the project documentation or contact the development team.

---

Built with ❤️ using React, Redux Saga, and modern web technologies
