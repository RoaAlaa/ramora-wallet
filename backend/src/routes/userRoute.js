const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validateRequest');
const {
    register,
    login,
    getUserProfile,
    updateUserProfile,
    updatePassword,
    addBucket,
    updateBucket,
    deleteBucket,
    updateBalance,
    getUserBuckets,
    getBalanceHistory,
    getUserStats
} = require('../controllers/userController');

// Public routes (no authentication required)
router.post('/register', validateRequest(schemas.register), register);
router.post('/login', validateRequest(schemas.login), login);

// Protected routes (require authentication)
router.use(auth);

// Profile management
router.get('/profile', getUserProfile);                 // Get user profile
router.put('/profile', validateRequest(schemas.updateProfile), updateUserProfile);              // Update user profile
router.put('/password', validateRequest(schemas.updatePassword), updatePassword);                // Update password

// Bucket management
router.get('/buckets', getUserBuckets);                 // Get all buckets
router.post('/buckets', validateRequest(schemas.addBucket), addBucket);                     // Add new bucket
router.put('/buckets/:bucketId', validateRequest(schemas.updateBucket), updateBucket);         // Update bucket
router.delete('/buckets/:bucketId', deleteBucket);      // Delete bucket

// Balance management
router.get('/balance/history', getBalanceHistory);      // Get balance history
router.put('/balance', validateRequest(schemas.updateBalance), updateBalance);                  // Update balance

// Statistics
router.get('/stats', getUserStats);                     // Get user statistics

module.exports = router;