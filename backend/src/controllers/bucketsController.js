const BucketService = require('../services/BucketService');
const UserService = require('../services/UserService');

// Create a new bucket
exports.createBucket = async (req, res) => {
    try {
        const { userId } = req.params;
        const { bucketName, amount } = req.body;

        if (!bucketName) {
            return res.status(400).json({ error: 'Bucket name is required' });
        }

        if (amount < 0) {
            return res.status(400).json({ error: 'Amount cannot be negative' });
        }

        const updatedUser = await BucketService.createBucket(userId, bucketName, amount || 0);
        const result = await UserService.getUserById(userId);

        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }

        res.status(200).json({
            message: 'Bucket created successfully',
            user: result.user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a bucket
exports.updateBucket = async (req, res) => {
    try {
        const { userId, bucketId } = req.params;
        const { name, amount } = req.body;

        if (!name && amount === undefined) {
            return res.status(400).json({ error: 'At least one field (name or amount) must be provided' });
        }

        if (amount !== undefined && amount < 0) {
            return res.status(400).json({ error: 'Amount cannot be negative' });
        }

        const updatedUser = await BucketService.updateBucket(userId, bucketId, name, amount);
        const result = await UserService.getUserById(userId);

        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }

        res.status(200).json({
            message: 'Bucket updated successfully',
            user: result.user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteBucket = async (req, res) => {
        try {
        const { userId } = req.params;
        const { bucketId } = req.body;


        if (!bucketId) {
            return res.status(400).json({ 
                success: false,
                message: 'Bucket ID is required in request body'
            });
        }

        // Call the service function
        const updatedUser = await BucketService.deleteBucket(userId, bucketId);
        const result = await UserService.getUserById(userId);
        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Bucket deleted successfully',
            user : result.User
        });

    } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
}
// Reset all buckets
exports.resetAllBuckets = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newBalance } = req.body;

        if (newBalance < 0) {
            return res.status(400).json({ error: 'Balance cannot be negative' });
        }

        const updatedUser = await BucketService.resetAllBuckets(userId, newBalance);
        const result = await UserService.getUserById(userId);

        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }

        res.status(200).json({
            message: 'Buckets reset successfully',
            user: result.user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all buckets
exports.getUserBuckets = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await UserService.getUserById(userId);

        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }

        res.status(200).json({
            buckets: result.user.buckets,
            balance: result.user.balance
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};