# Fashion Store - Backend

A comprehensive REST API for an e-commerce fashion store with user management, product management, cart functionality, and order processing.

## Core Features

- Complete user management (register, login, update, delete)
- Product management (CRUD operations)
- Shopping cart functionality
- Order processing and management
- Wishlist/favorites system
- Product search and filtering
- Image upload for products
- Role-based authorization (Customer, Admin)
- Secure payment processing
- Advanced security

## Tech Stack

- Node.js & Express.js
- MongoDB (supports both local and Atlas)
- JWT for authentication
- Bcrypt for password hashing
- Express-async-handler for error handling
- Multer for file uploads
- CORS for cross-origin resource sharing
- Express-session for session management

## Installation

## Prerequisites

1. Node.js (v14 or higher)
2. MongoDB
3. npm or yarn

## Setup

1. Clone the repository

```bash
git clone <repository-url>
cd fashion-store-backend
```

1. Install dependencies

```bash
npm install
```

1. Set up environment variables

Create a .env file in the root directory with the following variables:

```bash
MONGODB_URI=your-connection-string
JWT_SECRET=your-secret-key
PORT=5000
```

1. Start the development server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `GET /api/products/top` - Get top-rated products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new` - Get new products
- `GET /api/products/sale` - Get products on sale
- `GET /api/products/categories` - Get product categories
- `GET /api/products/brands` - Get product brands
- `POST /api/products/:id/reviews` - Create product review
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/:itemId` - Update cart item quantity
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `DELETE /api/orders/:id` - Delete order (admin only)
- `GET /api/orders` - Get all orders (admin only)

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/favorites` - Get user's favorite products
- `POST /api/users/favorites/:id` - Add product to favorites
- `DELETE /api/users/favorites/:id` - Remove product from favorites
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user details (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Security Features

- JWT authentication for protected routes
- Password hashing with bcrypt
- Input validation with Joi
- CORS protection
- Rate limiting for DDoS protection
- Auto logout after 4 hours of inactivity

## Additional Features

- Product image upload support
- Built-in logging system
- Development and production environment support
- Clean, modular code architecture
- Comprehensive error handling
- Auto-cleanup for old logs

## Project Structure

```text
BackEnd/
├── Config/
│   ├── db.js
│   └── initialData.js
├── Controllers/
│   ├── cartController.js
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── Middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── loggerMiddleware.js
│   ├── uploadMiddleware.js
│   └── validationMiddleware.js
├── Models/
│   ├── Cart.js
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── Routes/
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── validators/
│   ├── productValidator.js
│   └── userValidator.js
├── styles/
│   ├── components/
│   ├── pages/
│   └── utils/
├── logs/
├── uploads/
├── .env
└── app.js
```

## Development

- Server entry point is `app.js`
- Error logs are stored in `/logs`
- Development mode includes:
  - Detailed error messages
  - Auto-restart with nodemon
  - Environment-specific logging

## Production

- Optimized for performance
- Limited error details
- Enhanced security measures
- Environment-specific configurations

## Developer

David Tabibov - Fashion Store Backend Developer

## License

This project is licensed under the MIT License.
 
 