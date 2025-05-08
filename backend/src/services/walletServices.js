const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const BucketService = require('./BucketService');

class WalletService {

    async transferMoney(sender, receiver, amount, note = '', bucketName = DEFAULT_BUCKET) {

    }
}

module.exports = new WalletService();