const express = require('express');
const router = express.Router();
const bucketController = require('../controllers/bucketsController');

router.post('/:userId/buckets', bucketController.createBucket);
router.post('/:userId/buckets/reset', bucketController.resetAllBuckets);
router.get('/:userId/buckets', bucketController.getUserBuckets);

module.exports = router;