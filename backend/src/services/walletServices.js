const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const BucketService = require('./BucketService');
const {DEFAULT_BUCKET} = require('../config/constants');


class WalletService {

    async SendMoney(userId, receiverUsername, amount, note = '', bucketName = DEFAULT_BUCKET) {

        try
        {
            if (amount <= 0) 
            {
                throw new Error("Amount must be greater than zero");
            }

            const sender = await User.findById(userId);
            const receiver = await User.findOne({username : receiverUsername});

            const bucket = await sender.buckets.find(b => b.name === bucketName);

            
            if (!bucket) throw new Error(`Bucket "${bucketName}" not found`);
            
            if (!sender) {
            throw new Error("Sender not found");
            }

            if (!receiver)
            {
                throw new Error("user is not found");
            }
            if (receiver.status === 'suspended')
            {
                throw new Error("this user is suspended");
            }
            if(sender.balance < amount)
            {
                throw new Error("your balance is not enough");
            }
            if (sender.username === receiverUsername) 
            {
            throw new Error("Cannot send money to yourself");
            }




            sender.balance -= amount;
            receiver.balance += amount;

            if (bucket.amount < amount)
            {
                BucketService.resetAllBuckets(sender._id,sender.balance)
            }
            else
            {
                bucket.amount -= amount;
            }

            await sender.save();
            await receiver.save();

            const transaction = new Transaction({
                sender: sender._id,
                receiver : receiver._id,
                amount: amount,
                type: "send",
                status: "completed",
                note: note
            });

            await transaction.save();

            return { success: true, transaction };
    }
    catch(error)
    {
        return {success: false, error: error.message};
    }
    }


    async requestMoney(userId,receiverUsername,amount, note = '')
    {
        try
        {
            if (amount <= 0) 
            {
                throw new Error("Amount must be greater than zero");
            }

            const sender = await User.findById(userId);
            const receiver = await User.findOne({username : receiverUsername});

            if (!receiver)
            {
                throw new Error("user is not found");
            }
            if (receiver.status === 'suspended')
            {
                throw new Error("this user is suspended");
            }
            if (sender.username === receiverUsername) 
            {
            throw new Error("Cannot request money from yourself");
            }

            const transaction = new Transaction({
                sender: sender._id,
                receiver : receiver._id,
                amount: amount,
                type: "request",
                note: note
            });

            await transaction.save();

            return { success: true, transaction };
        }
        catch(error)
        {
            return {sucess: false, error: error.message};
        }
    }



    async respondToMoneyRequest(transactionId, check)
    {
        try
        {
            const transaction = await Transaction.findById(transactionId);
            if(transaction.status !== 'pending')
            {
                throw new error("there is no transaction is not pending")
            }

            if (!check)
            {
                transaction.status = 'rejected';
            }
            else{
                const requestReceiver = await User.findById(transaction.receiver);
                const requestSender = await User.findById(transaction.sender);
                
                if (requestReceiver.balance < transaction.amount)
                {
                    throw new error("your balance is not enough");
                }
                
                requestReceiver.balance -= transaction.amount;
                requestSender.balance += transaction.amount;

                if (requestReceiver.buckets[0].amount < transaction.amount)
                {
                    BucketService.resetAllBuckets(requestReceiver._id,requestReceiver.balance)
                }
                else
                {
                    requestReceiver.buckets[0].amount -= transaction.amount;
                }

                transaction.status = 'completed'

                await transaction.save();
                await requestReceiver.save();
                await requestSender.save();
            }

            return {
            success: true,
            status: 'completed',
            transactionId: transaction._id,
            amount: transaction.amount
        };
        }
        catch(error)
        {
            return {sucess: false, error: error.message};
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

            if (!requests) throw new error("no requests");
            
            return {
                success: true,
                requests: requests.map(request => ({
                    id: request._id,
                    amount: request.amount,
                    note: request.note,
                    createdAt: request.createdAt,
                    sender: {
                        username: request.sender.username,
                        name: request.sender.name
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
            transactions: transactions.map(tx => ({
                id: tx._id,
                type: tx.type,
                amount: tx.amount,
                note: tx.note,
                status: tx.status,
                createdAt: tx.createdAt,
                direction: tx.sender._id.equals(userId) ? 'sent' : 'received',
                counterpart: tx.sender._id.equals(userId) ? 
                    { username: tx.receiver.username, name: tx.receiver.name } :
                    { username: tx.sender.username, name: tx.sender.name }
                }))
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new WalletService();