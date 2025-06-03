# Luxe Fashion Boutique - Frontend

A modern, responsive React application for a premium fashion e-commerce platform with elegant design and seamless user experience.

## 🌟 Core Features

- **Modern UI/UX**: Premium design with Tailwind CSS and Bootstrap
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **User Authentication**: Complete login/register system with protected routes
- **Product Management**: Browse, search, filter, and view detailed product information
- **Shopping Experience**: Cart management, wishlist, and streamlined checkout
- **User Profile**: Account management and order history
- **Admin Dashboard**: Product and user management for administrators
- **Performance Optimized**: Lazy loading, code splitting, and optimized assets
- **Accessibility**: WCAG compliant with screen reader support
- **Custom Branding**: Professional logo and favicon system

## 🛠️ Tech Stack

- **Framework**: React 18 with Hooks
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS + Bootstrap 5 + Custom CSS
- **UI Components**: React Bootstrap + Heroicons + React Icons
- **Form Management**: Formik with Yup validation
- **Animations**: Framer Motion for smooth transitions
- **HTTP Client**: Axios for API communication
- **Build Tool**: Vite for fast development and building
- **Development Tools**: Concurrently for running multiple processes

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see Backend README)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_IMAGE_URL=http://localhost:5000
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5174/` (or the next available port)

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts development server with MCP browser tools |
| `npm run start-app` | Starts only the Vite development server |
| `npm run start-mcp` | Starts only the MCP browser tools |
| `npm run build` | Creates production build |
| `npm run preview` | Preview production build locally |
| `npm start` | Alternative start command |

## 🎨 Brand Assets

### Custom Logo & Favicon System
- **Full Logo** (`/public/logo.svg`): 200x200 premium logo with golden hanger icon
- **Standard Favicon** (`/public/favicon.svg`): 32x32 optimized for browser tabs
- **Small Favicon** (`/public/favicon-16x16.svg`): 16x16 minimal design for tiny displays
- **Manifest Icons**: Progressive Web App support with multiple sizes

### Testing Favicon
Visit `http://localhost:5174/test-favicon.html` to preview all logo variations and test favicon functionality.

## 📁 Project Structure

```
Frontend/
├── public/
│   ├── logo.svg                  # Brand logo (200x200)
│   ├── favicon.svg               # Standard favicon (32x32)
│   ├── favicon-16x16.svg         # Small favicon (16x16)
│   ├── manifest.json             # PWA manifest
│   └── test-favicon.html         # Favicon testing page
├── src/
│   ├── assets/
│   │   ├── icons/                # Custom icon assets
│   │   └── images/               # Image assets
│   ├── components/
│   │   ├── accessibility/        # Accessibility components
│   │   ├── Admin/                # Admin dashboard components
│   │   ├── auth/                 # Authentication components
│   │   ├── cart/                 # Shopping cart components
│   │   ├── checkout/             # Checkout process components
│   │   ├── common/               # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── ErrorMessage/
│   │   │   ├── Loading/
│   │   │   ├── Pagination/
│   │   │   ├── ScrollToTop/
│   │   │   └── Toast/
│   │   ├── Layout/               # Layout components
│   │   ├── notifications/        # Notification system
│   │   ├── products/             # Product-related components
│   │   │   ├── ProductCard/
│   │   │   ├── ProductDetails/
│   │   │   ├── ProductFilters/
│   │   │   ├── ProductGallery/
│   │   │   ├── ProductGrid/
│   │   │   ├── ProductInfo/
│   │   │   ├── ProductList/
│   │   │   └── ProductReviews/
│   │   ├── profile/              # User profile components
│   │   └── user/                 # User management components
│   ├── context/                  # React Context providers
│   ├── hooks/                    # Custom React hooks
│   ├── middleware/               # Route middleware
│   ├── pages/                    # Page components
│   │   ├── About/
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Contact/
│   │   ├── Home/
│   │   ├── NotFound/
│   │   ├── Orders/
│   │   ├── Policies/
│   │   ├── Product/
│   │   ├── Products/
│   │   ├── Profile/
│   │   ├── user/
│   │   └── Wishlist/
│   ├── routes/                   # Route configurations
│   ├── services/                 # API service functions
│   ├── styles/                   # Styling files
│   │   ├── components/           # Component-specific styles
│   │   ├── layout/               # Layout styles
│   │   ├── pages/                # Page-specific styles
│   │   ├── products/             # Product-related styles
│   │   └── themes/               # Theme configurations
│   ├── utils/                    # Utility functions
│   └── main.jsx                  # Application entry point
├── .gitignore
├── eslint.config.js
├── index.html                    # HTML template
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🎯 Key Features

### 🛍️ Shopping Experience
- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: High-quality images, reviews, and detailed information
- **Shopping Cart**: Add, update, remove items with real-time calculations
- **Wishlist**: Save favorite products for later
- **Checkout**: Secure, multi-step checkout process

### 👤 User Management
- **Authentication**: Login/register with form validation
- **Profile Management**: Update personal information and preferences
- **Order History**: Track current and past orders
- **Address Management**: Save and manage shipping addresses

### 🔧 Admin Features
- **Dashboard**: Overview of store statistics and metrics
- **Product Management**: Add, edit, delete products with image upload
- **Order Management**: Process and track customer orders
- **User Management**: View and manage customer accounts

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablet screens
- **Desktop Enhanced**: Full-featured desktop experience

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading for faster initial load
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Efficient browser caching strategies
- **Bundle Optimization**: Tree shaking and minification
- **CDN Integration**: External resources loaded from CDN

## ♿ Accessibility Features

- **WCAG 2.1 AA Compliance**: Meeting accessibility standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast mode
- **Focus Management**: Clear focus indicators

## 🌐 SEO Optimization

- **Meta Tags**: Dynamic meta tags for each page
- **Open Graph**: Social media sharing optimization
- **Structured Data**: Rich snippets for search engines
- **Sitemap**: XML sitemap generation
- **Performance**: Core Web Vitals optimization

## 🔐 Security Features

- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Content Security Policy implementation
- **Authentication**: JWT token management
- **Route Protection**: Private routes for authenticated users

## 🧪 Testing

### Favicon Testing
1. Visit `http://localhost:5174/test-favicon.html`
2. Check browser tab for favicon display
3. Bookmark the page to test bookmark favicon
4. Test on different browsers and devices

### Manual Testing
- Test all user flows (registration, login, shopping, checkout)
- Verify responsive design on different screen sizes
- Check accessibility with screen readers
- Validate form inputs and error handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables for Production
```bash
VITE_API_URL=https://your-api-domain.com/api
VITE_IMAGE_URL=https://your-api-domain.com
```

## 🔧 Development Workflow

1. **Feature Development**: Create feature branches from main
2. **Component Structure**: Follow the established component hierarchy
3. **Styling**: Use Tailwind classes with custom CSS when needed
4. **State Management**: Use React Context for global state
5. **API Integration**: Use Axios services for all API calls
6. **Testing**: Test components manually and with different browsers

## 🛠️ Configuration Files

- **`vite.config.js`**: Vite build configuration
- **`tailwind.config.js`**: Tailwind CSS customization
- **`postcss.config.js`**: PostCSS plugins configuration
- **`eslint.config.js`**: ESLint rules and configuration

## 🐛 Debugging

### Development Tools
- **React Developer Tools**: Browser extension for React debugging
- **Vite Dev Server**: Hot module replacement for fast development
- **Console Logging**: Comprehensive error logging
- **Network Tab**: Monitor API calls and responses

### Common Issues
- **CORS Errors**: Ensure backend CORS is configured correctly
- **Favicon Cache**: Clear browser cache if favicon doesn't update
- **Route Issues**: Check React Router configuration
- **Build Errors**: Verify all imports and dependencies

## 📈 Performance Monitoring

- **Lighthouse Scores**: Regular performance audits
- **Core Web Vitals**: Monitor loading, interactivity, and visual stability
- **Bundle Analysis**: Track bundle size and optimization opportunities
- **User Experience**: Monitor user interactions and feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the component structure and naming conventions
4. Test your changes thoroughly
5. Submit a pull request with detailed description

## 📄 License

This project is part of the Luxe Fashion Boutique full-stack application.

## 👨‍💻 Developer

**David Tabibov**
- Full-Stack Developer
- Specialized in React.js and modern web technologies

---

For backend documentation, see [Backend README](../Backend/README.MD)
