require('dotenv').config({ path: '../.env' }); 
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { apiLimiter, authLimiter, transactionLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { validateRequest, schemas } = require('./middleware/validateRequest');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);
app.use('/api/transactions', transactionLimiter);

// Routes
const userRoutes = require('./routes/userRoute');
const transactionRoutes = require('./routes/transactionRoute');

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});