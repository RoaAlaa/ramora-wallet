const WalletService = require('../services/walletServices');

exports.sendMoney = async (req, res) => {
    try {
        const { userId, receiverUsername } = req.params;
        const { amount, note, bucketName } = req.body;

        const result = await WalletService.SendMoney(
            userId, 
            receiverUsername, 
            amount, 
            note, 
            bucketName
        );

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json({
            message: 'Money sent successfully',
            transaction: result.transaction
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Request money from another user
exports.requestMoney = async (req, res) => {
    try {
        const { userId, receiverUsername } = req.params;
        const { amount, note } = req.body;

        const result = await WalletService.requestMoney(
            userId,
            receiverUsername,
            amount,
            note
        );

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json({
            message: 'Money request sent successfully',
            transaction: result.transaction
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Respond to money request
exports.respondToRequest = async (req, res) => {
    try {
        const { userId, transactionId } = req.params;
        const { response } = req.body;

        // Validate input
        if (typeof response !== 'boolean') {
            return res.status(400).json({ 
                error: 'Response must be a boolean value (true/false)' 
            });
        }

        const result = await WalletService.respondToMoneyRequest(transactionId, response);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json({
            status: result.status,
            transactionId: result.transactionId,
            amount: result.amount,
            newBalance: result.newBalance
        });
    } catch (error) {
        console.error('Error in respondToRequest:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.viewRequests = async (req, res) => {
    try {
        const { receiverId } = req.body;

        const result = await WalletService.viewRequests(receiverId);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json({
            requests: result.requests
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await WalletService.getTransactionHistory(userId);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json({
            transactions: result.transactions
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};