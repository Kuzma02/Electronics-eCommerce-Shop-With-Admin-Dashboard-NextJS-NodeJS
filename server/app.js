const express = require("express");
const bcrypt = require('bcryptjs');
const fileUpload = require("express-fileupload");
const productsRouter = require("./routes/products");
const productImagesRouter = require("./routes/productImages");
const categoryRouter = require("./routes/category");
const searchRouter = require("./routes/search");
const mainImageRouter = require("./routes/mainImages");
const userRouter = require("./routes/users");
const orderRouter = require("./routes/customer_orders");
const slugRouter = require("./routes/slugs");
const orderProductRouter = require('./routes/customer_order_product');
const wishlistRouter = require('./routes/wishlist');
var cors = require("cors");

// Import rate limiting middleware
const {
  generalLimiter,
  authLimiter,
  registerLimiter,
  userManagementLimiter,
  uploadLimiter,
  searchLimiter,
  orderLimiter
} = require('./middleware/rateLimiter');

const {
  passwordResetLimiter,
  adminLimiter,
  wishlistLimiter,
  productLimiter
} = require('./middleware/advancedRateLimiter');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.NEXTAUTH_URL,
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined values

// CORS configuration with origin validation
const corsOptions = {
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);
    

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    

    if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // Reject other origins
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies and authorization headers
};

// Apply general rate limiting to all routes
app.use(generalLimiter);

app.use(express.json());
app.use(cors(corsOptions));
app.use(fileUpload());

// Apply specific rate limiters to different route groups
app.use("/api/users", userManagementLimiter);
app.use("/api/search", searchLimiter);
app.use("/api/orders", orderLimiter);
app.use("/api/order-product", orderLimiter);
app.use("/api/images", uploadLimiter);
app.use("/api/main-image", uploadLimiter);
app.use("/api/wishlist", wishlistLimiter);
app.use("/api/products", productLimiter);

// Apply stricter rate limiting to authentication-related routes
app.use("/api/users/email", authLimiter); // For login attempts via email lookup

// Apply admin rate limiting to admin routes
app.use("/api/users", adminLimiter); // Admin user management

app.use("/api/products", productsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/images", productImagesRouter);
app.use("/api/main-image", mainImageRouter);
app.use("/api/users", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/orders", orderRouter);
app.use('/api/order-product', orderProductRouter);
app.use("/api/slugs", slugRouter);
app.use("/api/wishlist", wishlistRouter);

// Health check endpoint (no rate limiting)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    rateLimiting: 'enabled'
  });
});

// Rate limit info endpoint
app.get('/rate-limit-info', (req, res) => {
  res.status(200).json({
    general: '100 requests per 15 minutes',
    auth: '5 login attempts per 15 minutes',
    register: '3 registrations per hour',
    upload: '10 uploads per 15 minutes',
    search: '30 searches per minute',
    orders: '15 order operations per 15 minutes',
    wishlist: '20 operations per 5 minutes',
    products: '60 requests per minute'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Rate limiting enabled for all endpoints');
});
