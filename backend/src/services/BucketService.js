const User = require('../models/User.model');
const { BUCKET_LIMIT, DEFAULT_BUCKET } = require('../config/constants');

class BucketService {

/////////////////////// create new bucket //////////////////////////////////////////
    async createBucket(userId, bucketName, amount) {
        if (bucketName === DEFAULT_BUCKET) {
            throw new Error(`Cannot create bucket named '${DEFAULT_BUCKET}'`);
        }

        if (amount < 0) throw new Error("Balance cannot be negative");

        const user = await User.findById(userId);
        
        if (user.buckets.length >= BUCKET_LIMIT) {
            throw new Error(`Maximum ${BUCKET_LIMIT} buckets allowed`);
        }


        if (user.buckets.some(b => b.name === bucketName)) {
            throw new Error ('Bucket already exists');
        }

        if (user.balance < amount)
        {
            throw new Error ('your balance is not enough');
        }

        if (user.buckets[0].amount < amount)
        {
            throw new Error ('your have to rebalance your buckets');
        }

    user.buckets[0].amount -= amount;
    await user.save();

    // 2. Add the new bucket
    user.buckets.push({ name: bucketName, amount });
    await user.save();

    return user;
    }

////////////////////////// reset all buckets ////////////////////////////////
    async resetAllBuckets(userId,newBalance)
    {
        try{
            const user = await User.findById(userId);

            user.buckets = (user.buckets || []).map(bucket => ({
                ...bucket.toObject(),
                amount: 0
            }));out

            if(user.buckets.length > 0)
            {
                user.buckets[0].amount = newBalance;
            }

            await user.save();

            return user;
        }
        catch(Error){
            throw Error;
        }
    }



    /////////////////// getters /////////////////////////
    async getUserBuckets(userId) {
        const user = await User.findById(userId).select('buckets balance');
        return [
            ...user.buckets,
            { name: DEFAULT_BUCKET, amount: user.balance - this._getBucketsTotal(user) }
        ];
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