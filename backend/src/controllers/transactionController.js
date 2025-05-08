const TransactionService = require('../services/TransactionService');

exports.createTransaction = async (req, res) => {
    try {
        const { receiverId, amount, type, note } = req.body;

        // Basic validation
        if (!receiverId || !amount || !type) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const transaction = await TransactionService.createTransaction(
            req.user._id,
            receiverId,
            amount,
            type,
            note
        );

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            transaction
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await TransactionService.getUserTransactions(req.user._id);
        res.status(200).json({
            success: true,
            transactions
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const { transactionId } = req.params;
        
        if (!transactionId) {
            return res.status(400).json({
                success: false,
                error: 'Transaction ID is required'
            });
        }

        const transaction = await TransactionService.getTransactionById(transactionId);
        
        // Check if user is part of the transaction
        if (transaction.sender._id.toString() !== req.user._id.toString() && 
            transaction.receiver._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view this transaction'
            });
        }

        res.status(200).json({
            success: true,
            transaction
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Status is required'
            });
        }

        const transaction = await TransactionService.updateTransactionStatus(
            transactionId,
            status,
            req.user._id
        );

        res.status(200).json({
            success: true,
            message: 'Transaction status updated successfully',
            transaction
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
};

exports.getTransactionStats = async (req, res) => {
    try {
        const stats = await TransactionService.getTransactionStats(req.user._id);
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getPendingTransactions = async (req, res) => {
    try {
        const transactions = await TransactionService.getTransactionsByStatus(req.user._id, 'pending');
        res.json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getCompletedTransactions = async (req, res) => {
    try {
        const transactions = await TransactionService.getTransactionsByStatus(req.user._id, 'completed');
        res.json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.searchTransactions = async (req, res) => {
    try {
        const { query, startDate, endDate, minAmount, maxAmount, type, status } = req.query;
        const transactions = await TransactionService.searchTransactions(req.user._id, {
            query,
            startDate,
            endDate,
            minAmount,
            maxAmount,
            type,
            status
        });
        res.json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 