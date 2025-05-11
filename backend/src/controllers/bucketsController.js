const BucketService = require('../services/BucketService');

// Create a new bucket
exports.createBucket = async (req, res) => {
    try {
        const { userId } = req.params;
        const { bucketName, amount } = req.body;

        const updatedUser = await BucketService.createBucket(userId, bucketName, amount);

        res.status(200).json({
            message: 'Bucket created successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Reset all buckets to zero and set first bucket's amount
exports.resetAllBuckets = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newBalance } = req.body;

        const updatedUser = await BucketService.resetAllBuckets(userId, newBalance);

        res.status(200).json({
            message: 'Buckets reset successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all buckets (including DEFAULT_BUCKET)
exports.getUserBuckets = async (req, res) => {
    try {
        const { userId } = req.params;
        const buckets = await BucketService.getUserBuckets(userId);

        res.status(200).json({
            buckets
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};