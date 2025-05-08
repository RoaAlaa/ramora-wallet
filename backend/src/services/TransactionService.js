const Transaction = require('../models/Transaction.model');
const User = require('../models/User.model');

class TransactionService {
    async createTransaction(senderId, receiverId, amount, type, note) {
        // Input validation
        if (!senderId || !receiverId || !amount || !type) {
            throw new Error('Missing required fields');
        }

        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        if (!['send', 'request'].includes(type)) {
            throw new Error('Invalid transaction type');
        }

        // Prevent self-transactions
        if (senderId.toString() === receiverId.toString()) {
            throw new Error('Cannot send money to yourself');
        }

        // Validate users exist
        const [sender, receiver] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverId)
        ]);

        if (!sender || !receiver) {
            throw new Error('Invalid sender or receiver');
        }

        // For send transactions, check sender's balance
        if (type === 'send' && sender.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Create transaction
        const transaction = new Transaction({
            sender: senderId,
            receiver: receiverId,
            amount,
            type,
            note,
            status: type === 'send' ? 'completed' : 'pending'
        });

        // Update balances if it's a send transaction
        if (type === 'send') {
            try {
                await Promise.all([
                    User.findByIdAndUpdate(senderId, { $inc: { balance: -amount } }),
                    User.findByIdAndUpdate(receiverId, { $inc: { balance: amount } })
                ]);
            } catch (error) {
                throw new Error('Failed to update balances');
            }
        }

        await transaction.save();
        return transaction;
    }

    async getUserTransactions(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Get transactions using the user method
        const transactions = await user.getTransactions();
        
        // Get transaction statistics
        const stats = await user.getTransactionStats();

        return {
            transactions,
            stats
        };
    }

    async getTransactionById(transactionId) {
        if (!transactionId) {
            throw new Error('Transaction ID is required');
        }

        const transaction = await Transaction.findById(transactionId)
            .populate('sender', 'name username')
            .populate('receiver', 'name username');

        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    }

    async updateTransactionStatus(transactionId, status, userId) {
        if (!transactionId || !status) {
            throw new Error('Transaction ID and status are required');
        }

        if (!['pending', 'completed', 'rejected'].includes(status)) {
            throw new Error('Invalid status');
        }

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Only allow status updates for pending transactions
        if (transaction.status !== 'pending') {
            throw new Error('Can only update pending transactions');
        }

        // For completed transactions, update balances
        if (status === 'completed' && transaction.type === 'request') {
            const [sender, receiver] = await Promise.all([
                User.findById(transaction.sender),
                User.findById(transaction.receiver)
            ]);

            if (sender.balance < transaction.amount) {
                throw new Error('Insufficient balance to complete transaction');
            }

            await Promise.all([
                User.findByIdAndUpdate(transaction.sender, { $inc: { balance: -transaction.amount } }),
                User.findByIdAndUpdate(transaction.receiver, { $inc: { balance: transaction.amount } })
            ]);
        }

        transaction.status = status;
        await transaction.save();
        return transaction;
    }

    async getTransactionStats(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const stats = await user.getTransactionStats();
        return stats;
    }

    async getTransactionsByStatus(userId, status) {
        if (!['pending', 'completed', 'rejected'].includes(status)) {
            throw new Error('Invalid status');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const transactions = await Transaction.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ],
            status: status
        })
        .populate('sender', 'name username')
        .populate('receiver', 'name username')
        .sort({ createdAt: -1 });

        return transactions;
    }

    async searchTransactions(userId, filters) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Build query
        const query = {
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        };

        // Add filters if provided
        if (filters.query) {
            query.note = { $regex: filters.query, $options: 'i' };
        }

        if (filters.startDate || filters.endDate) {
            query.createdAt = {};
            if (filters.startDate) {
                query.createdAt.$gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                query.createdAt.$lte = new Date(filters.endDate);
            }
        }

        if (filters.minAmount || filters.maxAmount) {
            query.amount = {};
            if (filters.minAmount) {
                query.amount.$gte = parseFloat(filters.minAmount);
            }
            if (filters.maxAmount) {
                query.amount.$lte = parseFloat(filters.maxAmount);
            }
        }

        if (filters.type) {
            query.type = filters.type;
        }

        if (filters.status) {
            query.status = filters.status;
        }

        const transactions = await Transaction.find(query)
            .populate('sender', 'name username')
            .populate('receiver', 'name username')
            .sort({ createdAt: -1 });

        return transactions;
    }
}

module.exports = new TransactionService(); 