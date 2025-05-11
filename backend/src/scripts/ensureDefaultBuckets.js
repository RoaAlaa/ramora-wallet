const mongoose = require('mongoose');
const User = require('../models/User.model');
const { DEFAULT_BUCKET } = require('../config/constants');
require('dotenv').config();

async function ensureDefaultBuckets() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all users
        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        let updatedCount = 0;

        // Process each user
        for (const user of users) {
            let needsUpdate = false;

            // Initialize buckets array if it doesn't exist
            if (!user.buckets) {
                user.buckets = [];
                needsUpdate = true;
            }

            // Check for default bucket
            const defaultBucket = user.buckets.find(b => b.name === DEFAULT_BUCKET);
            if (!defaultBucket) {
                user.buckets.push({
                    name: DEFAULT_BUCKET,
                    amount: user.balance || 0
                });
                needsUpdate = true;
            }

            // Save if changes were made
            if (needsUpdate) {
                await user.save();
                updatedCount++;
            }
        }

        console.log(`Updated ${updatedCount} users`);
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the migration
ensureDefaultBuckets(); 