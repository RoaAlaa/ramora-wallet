const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validateRequest');
const {
    createTransaction,
    getUserTransactions,
    getTransaction,
    updateTransactionStatus,
    getTransactionStats,
    getPendingTransactions,
    getCompletedTransactions,
    searchTransactions
} = require('../controllers/transactionController');

// All transaction routes require authentication
router.use(auth);

// Transaction creation and retrieval
router.post('/', validateRequest(schemas.createTransaction), createTransaction);                     // Create new transaction
router.get('/', getUserTransactions);                    // Get user's transactions

// Transaction filtering and search
router.get('/search', validateRequest(schemas.searchTransactions), searchTransactions);               // Search transactions
router.get('/status/pending', getPendingTransactions);   // Get pending transactions
router.get('/status/completed', getCompletedTransactions); // Get completed transactions

// Statistics
router.get('/stats', getTransactionStats);              // Get transaction statistics

// Specific transaction operations
router.get('/:transactionId', getTransaction);           // Get specific transaction
router.patch('/:transactionId/status', validateRequest(schemas.updateTransactionStatus), updateTransactionStatus); // Update transaction status

module.exports = router; 