const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

class UserService {
    async register({name, username, email, phoneNumber, password}) {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            throw new Error('User is already exists');
        }

        const newUser = new User({
            name,
            username,
            email,
            phoneNumber,
            password
        });

        await newUser.save();

        const token = this.generateToken(newUser._id);
        return { user: newUser, token };
    }

    async login({username, password}) {
        const user = await User.findOne({username});

        if(!user) {
            throw new Error('Invalid username or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new Error('Invalid username or password');
        }
        const token = this.generateToken(user._id);

        return { user, token };
    }

    async getUserProfile(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUserProfile(userId, updateData) {
        const allowedUpdates = ['name', 'phoneNumber'];
        const updates = Object.keys(updateData)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async addBucket(userId, bucketData) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.buckets.push(bucketData);
        await user.save();
        return user.buckets[user.buckets.length - 1];
    }

    async updateBucket(userId, bucketId, updateData) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const bucket = user.buckets.id(bucketId);
        if (!bucket) {
            throw new Error('Bucket not found');
        }

        Object.assign(bucket, updateData);
        await user.save();
        return bucket;
    }

    async deleteBucket(userId, bucketId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const bucket = user.buckets.id(bucketId);
        if (!bucket) {
            throw new Error('Bucket not found');
        }

        bucket.remove();
        await user.save();
    }

    async updateBalance(userId, amount) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.balance += amount;
        await user.save();
        return user;
    }

    async updatePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return user;
    }

    generateToken(userId) {
        return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
    }

    async getUserBuckets(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user.buckets;
    }

    async getBalanceHistory(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Get all transactions involving this user
        const transactions = await user.getTransactions();
        
        // Create balance history entries
        const history = transactions.map(transaction => ({
            date: transaction.createdAt,
            amount: transaction.sender.toString() === userId.toString() ? -transaction.amount : transaction.amount,
            type: transaction.type,
            status: transaction.status,
            reference: transaction.reference,
            note: transaction.note
        }));

        return history.sort((a, b) => b.date - a.date);
    }

    async getUserStats(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Get transaction statistics
        const transactionStats = await user.getTransactionStats();

        // Get bucket statistics
        const bucketStats = {
            totalBuckets: user.buckets.length,
            totalBucketAmount: user.buckets.reduce((sum, bucket) => sum + bucket.amount, 0)
        };

        return {
            balance: user.balance,
            transactionStats,
            bucketStats
        };
    }
}

module.exports = new UserService();