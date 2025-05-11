const User = require('../models/User.model');
const { BUCKET_LIMIT, DEFAULT_BUCKET } = require('../config/constants');

class BucketService {

/////////////////////// create new bucket //////////////////////////////////////////
    async createBucket(userId, bucketName, amount) {
        if (bucketName === DEFAULT_BUCKET) {
            throw new Error(`Cannot create bucket named '${DEFAULT_BUCKET}'`);
        }

        if (amount < 0) {
            throw new Error("Amount cannot be negative");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        
        if (user.buckets.length >= BUCKET_LIMIT) {
            throw new Error(`Maximum ${BUCKET_LIMIT} buckets allowed`);
        }

        if (user.buckets.some(b => b.name === bucketName)) {
            throw new Error('Bucket with this name already exists');
        }

        const defaultBucket = user.buckets.find(b => b.name === DEFAULT_BUCKET);
        if (!defaultBucket) {
            throw new Error('Default bucket not found');
        }

        if (defaultBucket.amount < amount) {
            throw new Error('Insufficient funds in default bucket');
        }

        // Deduct from default bucket and add new bucket
        defaultBucket.amount -= amount;
        user.buckets.push({ name: bucketName, amount });
        await user.save();

        return user;
    }

    async updateBucket(userId, bucketId, name, amount) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const bucket = user.buckets.id(bucketId);
        if (!bucket) {
            throw new Error("Bucket not found");
        }

        if (bucket.name === DEFAULT_BUCKET) {
            throw new Error("Cannot modify default bucket");
        }

        if (name && name !== bucket.name) {
            if (user.buckets.some(b => b.name === name)) {
                throw new Error('Bucket with this name already exists');
            }
            bucket.name = name;
        }

        if (amount !== undefined) {
            const defaultBucket = user.buckets.find(b => b.name === DEFAULT_BUCKET);
            const amountDiff = amount - bucket.amount;

            if (amountDiff > 0 && defaultBucket.amount < amountDiff) {
                throw new Error('Insufficient funds in default bucket');
            }

            defaultBucket.amount -= amountDiff;
            bucket.amount = amount;
        }

        await user.save();
        return user;
    }

////////////////////////// reset all buckets ////////////////////////////////
    async resetAllBuckets(userId, newBalance) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        if (newBalance < 0) {
            throw new Error("Balance cannot be negative");
        }

        // Reset all buckets to 0 except default
        user.buckets = user.buckets.map(bucket => ({
            ...bucket.toObject(),
            amount: bucket.name === DEFAULT_BUCKET ? newBalance : 0
        }));

        user.balance = newBalance;
        await user.save();

        return user;
    }

    /////////////////// getters /////////////////////////
    async getUserBuckets(userId) {
        const user = await User.findById(userId).select('buckets balance');
        if (!user) {
            throw new Error("User not found");
        }
        return user.buckets;
    }

    _getOthersBucket(user) {
        return user.buckets.find(b => b.name === DEFAULT_BUCKET) || 
               { name: DEFAULT_BUCKET, amount: user.balance };
    }

    _getBucketsTotal(user) {
        return user.buckets.reduce((sum, b) => sum + b.amount, 0);
    }
}

module.exports = new BucketService();