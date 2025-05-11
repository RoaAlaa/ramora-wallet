const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { protect } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all routes
router.use(protect);

// Add balance route
router.post('/:userId/add-balance', walletController.addBalance);

// Money transfer endpoints
router.post('/:userId/send/:receiverUsername', walletController.sendMoney);
router.post('/:userId/request/:receiverUsername', walletController.requestMoney);

// Request management endpoints
router.put('/:userId/requests/:transactionId', walletController.respondToRequest);
router.get('/:userId/requests', walletController.viewRequests);

// Transaction history endpoint
router.get('/:userId/transactions', walletController.getTransactionHistory);

module.exports = router;