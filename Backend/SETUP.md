# Setup Guide - Fashion Store Backend

## 🚀 Quick Setup

### 1. Environment Variables
The application will run with default values, but for production you should create a `.env` file:

```bash
# Create .env file in the Backend directory
touch .env
```

Add these variables to your `.env` file:
```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/fashion-store

# JWT Configuration (IMPORTANT - Change this!)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Session Configuration
SESSION_SECRET=your-session-secret-key

# Server Configuration
NODE_ENV=development
PORT=5000
```

### 2. MongoDB Setup Options

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/fashion-store`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/atlas
2. Create cluster and get connection string
3. Add to `.env`: `MONGODB_URI_ATLAS=mongodb+srv://username:password@cluster.mongodb.net/fashion-store`

#### Option C: Docker MongoDB
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 3. Start the Server
```bash
npm install
npm start
```

## 🔧 Current Configuration

The application is configured to:
- ✅ Run without `.env` file (uses defaults)
- ✅ Auto-generate JWT_SECRET if missing  
- ✅ Fallback to local MongoDB
- ✅ Continue running even if MongoDB is unavailable (development mode)
- ✅ Create required directories automatically

## 🧪 Testing

1. **Health Check**: Visit `http://localhost:5000/health`
2. **API Test**: Use the included test files:
   - `test-registration.html` - Browser-based testing
   - `test-auth-flow.js` - Node.js testing script

## 🆘 Troubleshooting

### MongoDB Connection Issues
- **Error**: "MongooseError: The uri parameter to openUri() must be a string, got undefined"
- **Solution**: This is now fixed! The app provides default values.

### JWT Secret Issues  
- **Error**: "JWT_SECRET is not defined"
- **Solution**: This is now fixed! The app auto-generates a JWT secret if missing.

### Port Issues
- **Error**: "EADDRINUSE: address already in use :::5000"
- **Solution**: Kill existing processes: `npx kill-port 5000`

## 📁 Project Structure
```
Backend/
├── config/          # Database & environment config
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── uploads/         # File uploads (auto-created)
├── logs/           # Application logs (auto-created)
├── app.js          # Main application file
└── package.json    # Dependencies
```

## 🎯 Next Steps

1. Start backend: `npm start`
2. Start frontend: `cd ../Frontend && npm run dev`
3. Test authentication flow
4. Check navigation tab visibility
5. Verify form functionality

The application is now ready to run! 🚀 