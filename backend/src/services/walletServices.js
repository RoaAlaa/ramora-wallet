const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const BucketService = require('./BucketService');
const {DEFAULT_BUCKET} = require('../config/constants');


class WalletService {

    async SendMoney(userId, receiverUsername, amount, note = '', bucketName = DEFAULT_BUCKET) {
        try {
            if (amount <= 0) {
                throw new Error("Amount must be greater than zero");
            }

            const sender = await User.findById(userId);
            const receiver = await User.findOne({ username: receiverUsername });

            if (!sender) {
                throw new Error("Sender not found");
            }

            if (!receiver) {
                throw new Error("Recipient not found");
            }

            if (receiver.status === 'suspended') {
                throw new Error("This user is suspended");
            }

            const bucket = await sender.buckets.find(b => b.name === bucketName);
            if (!bucket) {
                throw new Error(`Bucket "${bucketName}" not found`);
            }

            if (sender.balance < amount) {
                throw new Error("Your balance is not enough");
            }

            if (sender.username === receiverUsername) {
                throw new Error("Cannot send money to yourself");
            }

            sender.balance -= amount;
            receiver.balance += amount;

            if (bucket.amount < amount) {
                await BucketService.resetAllBuckets(sender._id, sender.balance);
            } else {
                bucket.amount -= amount;
            }

            await sender.save();
            await receiver.save();

            const transaction = new Transaction({
                sender: sender._id,
                receiver: receiver._id,
                amount: amount,
                type: "send",
                status: "completed",
                note: note
            });

            await transaction.save();

            return { success: true, transaction };
        } catch(error) {
            return { success: false, error: error.message };
        }
    }


    async requestMoney(userId, receiverUsername, amount, note = '') {
        try {
            if (amount <= 0) {
                throw new Error("Amount must be greater than zero");
            }

            console.log('Looking for user with username:', receiverUsername);
            const requester = await User.findById(userId);  // Person requesting money
            const requestedFrom = await User.findOne({ username: receiverUsername.toLowerCase() });  // Person being requested from
            console.log('Person being requested from found:', requestedFrom ? 'yes' : 'no');

            if (!requester) {
                throw new Error("Requester not found");
            }

            if (!requestedFrom) {
                throw new Error("Recipient not found");
            }
            if (requestedFrom.status === 'suspended') {
                throw new Error("This user is suspended");
            }
            if (requester.username === receiverUsername.toLowerCase()) {
                throw new Error("Cannot request money from yourself");
            }

            const transaction = new Transaction({
                sender: requester._id,  // The person requesting the money (initiator)
                receiver: requestedFrom._id,  // The person being requested from (who will need to approve)
                amount: amount,
                type: "request",
                status: "pending",
                note: note
            });

            await transaction.save();
            console.log('Transaction saved successfully');

            return { success: true, transaction };
        } catch(error) {
            console.error('Request money error:', error.message);
            return { success: false, error: error.message };
        }
    }



    async respondToMoneyRequest(transactionId, check) {
        try {
            const transaction = await Transaction.findById(transactionId);
            if (!transaction || transaction.status !== 'pending') {
                throw new Error("Transaction not found or not pending");
            }

            if (!check) {
                transaction.status = 'rejected';
                await transaction.save();
                return {
                    success: true,
                    status: 'rejected',
                    transactionId: transaction._id,
                    amount: transaction.amount
                };
            }

            // Get the users involved
            const requester = await User.findById(transaction.sender);    // Person who requested money
            const requestedFrom = await User.findById(transaction.receiver); // Person who received the request

            if (!requester || !requestedFrom) {
                throw new Error("One or both users not found");
            }

            // Check if the person accepting has enough balance
            if (requestedFrom.balance < transaction.amount) {
                throw new Error("Your balance is not enough");
            }

            // Transfer the money
            requestedFrom.balance -= transaction.amount;
            requester.balance += transaction.amount;

            // Update the default bucket's amount for the person sending money
            const defaultBucket = requestedFrom.buckets.find(b => b.name === DEFAULT_BUCKET);
            if (!defaultBucket) {
                throw new Error("Default bucket not found");
            }

            if (defaultBucket.amount < transaction.amount) {
                await BucketService.resetAllBuckets(requestedFrom._id, requestedFrom.balance);
            } else {
                defaultBucket.amount -= transaction.amount;
            }

            // Complete the transaction
            transaction.status = 'completed';

            // Save all changes
            await transaction.save();
            await requestedFrom.save();
            await requester.save();

            return {
                success: true,
                status: 'completed',
                transactionId: transaction._id,
                amount: transaction.amount
            };
        } catch (error) {
            console.error('Respond to money request error:', error);
            return { success: false, error: error.message };
        }
    }


async viewRequests(receiverId) {
    try {
        const requests = await Transaction.find({
            receiver: receiverId,
            type: 'request',
            status: 'pending'
        })
        .sort({ createdAt: -1 }) // Newest first
        .populate('sender', 'username name') // Basic sender info
        .lean();

        if (!requests || requests.length === 0) {
            return {
                success: true,
                requests: [] // Return empty array if no requests found
            };
        }
        
        return {
            success: true,
            requests: requests.map(request => ({
                id: request._id,
                amount: request.amount,
                note: request.note,
                createdAt: request.createdAt,
                sender: request.sender ? {
                    username: request.sender.username || 'deleted account',
                    name: request.sender.name || 'deleted account'
                } : {
                    username: 'deleted account',
                    name: 'deleted account'
                }
            }))
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
async getTransactionHistory(userId) {
    try {
        // 1. Get all transactions where user is sender OR receiver
        const transactions = await Transaction.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
        .sort({ createdAt: -1 }) // Newest first
        .populate('sender', 'username name')
        .populate('receiver', 'username name')
        .lean();

        // 2. Format the response
        return {
            success: true,
            transactions: transactions.map(tx => {
                const isSender = tx.sender && tx.sender._id.equals(userId);
                const isReceiver = tx.receiver && tx.receiver._id.equals(userId);
                
                // Determine direction and counterpart
                let direction, counterpart;
                
                if (isSender) {
                    direction = 'sent';
                    counterpart = {
                        username: tx.receiver?.username || 'deleted account',
                        name: tx.receiver?.name || 'deleted account'
                    };
                } else if (isReceiver) {
                    direction = 'received';
                    counterpart = {
                        username: tx.sender?.username || 'deleted account',
                        name: tx.sender?.name || 'deleted account'
                    };
                } else {
                    // This shouldn't happen if data is consistent
                    direction = 'unknown';
                    counterpart = {
                        username: 'deleted account',
                        name: 'deleted account'
                    };
                }

                return {
                    id: tx._id,
                    type: tx.type,
                    amount: tx.amount,
                    note: tx.note,
                    status: tx.status,
                    createdAt: tx.createdAt,
                    direction: direction,
                    counterpart: counterpart
                };
            })
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

    async addBalance(userId, amount) {
        try {
            if (amount <= 0) {
                throw new Error("Amount must be greater than zero");
            }

            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            // Update user's balance
            user.balance += amount;

            // Update the default bucket's amount
            const defaultBucket = user.buckets.find(b => b.name === DEFAULT_BUCKET);
            if (defaultBucket) {
                defaultBucket.amount += amount;
            }

            await user.save();

            // Create a transaction record
            const transaction = new Transaction({
                sender: userId,
                receiver: userId,
                amount: amount,
                type: "deposit",
                status: "completed",
                note: "Added money to wallet"
            });

            await transaction.save();

            return {
                success: true,
                newBalance: user.balance,
                transaction
            };
        } catch (error) {
            console.error('Add balance error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new WalletService();