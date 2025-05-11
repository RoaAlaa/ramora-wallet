const express = require('express');
const router = express.Router();
const bucketController = require('../controllers/bucketsController');
const { protect } = require('../middlewares/auth.middleware');

// All routes should be protected
router.use(protect);

// Create a new bucket
router.post('/:userId/buckets', bucketController.createBucket);

// Update a bucket
router.put('/:userId/buckets/:bucketId', bucketController.updateBucket);

// Reset all buckets
router.post('/:userId/buckets/reset', bucketController.resetAllBuckets);

// Get all buckets
router.get('/:userId/buckets', bucketController.getUserBuckets);

module.exports = router;