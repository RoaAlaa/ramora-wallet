const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { DEFAULT_BUCKET } = require('../config/constants');
// fel env ely oltly 3aleha el sobh 

// Normally keep this in env variables
const JWT_SECRET = process.env.JWT_SECRET_KEY;

class UserService {
    async register(name, username, email, phoneNumber, password) {
        try {
            const existingUser = await User.findOne({ 
                $or: [
                    { email },
                    { username }
                ]
            });

            if (existingUser) {
                return {
                    success: false,
                    error: 'User already exists with this email or username'
                };
            }

            const newUser = new User({
                name,
                username,
                email,
                phoneNumber,
                password,
                buckets: [{ 
                    name: DEFAULT_BUCKET, 
                    amount: 0
                }],
            });

            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
                expiresIn: '30d'
            });

            return {
                success: true,
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    username: newUser.username,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber,
                    balance: newUser.balance,
                    buckets: newUser.buckets
                },
                token
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async login(username, password) {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return {
                    success: false,
                    error: 'Invalid credentials'
                };
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return {
                    success: false,
                    error: 'Invalid credentials'
                };
            }

            const token = jwt.sign({ id: user._id }, JWT_SECRET, {
                expiresIn: '30d'
            });

            return {
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    balance: user.balance,
                    buckets: user.buckets
                },
                token
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findById(userId)
                .select('-password')
                .lean();

            if (!user) {
                return {
                    success: false,
                    error: 'User not found'
                };
            }

            // Initialize buckets array if it doesn't exist
            if (!user.buckets) {
                user.buckets = [];
            }

            // Ensure default bucket exists and has correct amount
            const defaultBucket = user.buckets.find(b => b.name === DEFAULT_BUCKET);
            if (!defaultBucket) {
                user.buckets.push({
                    name: DEFAULT_BUCKET,
                    amount: user.balance || 0
                });
                
                // Save the changes to the database
                await User.findByIdAndUpdate(userId, { buckets: user.buckets });
            }

            return {
                success: true,
                user: {
                    ...user,
                    buckets: user.buckets
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateUser(userId, updates) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: updates },
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return {
                    success: false,
                    error: 'User not found'
                };
            }

            return {
                success: true,
                user
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to update user: ' + error.message
            };
        }
    }

    async searchUsers(query) {
        try {
            if (!query) {
                return {
                    success: false,
                    error: 'Search query is required'
                };
            }

            const users = await User.find({
                $or: [
                    { username: { $regex: query, $options: 'i' } },
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            }).select('name username email phoneNumber');

            return {
                success: true,
                users
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new UserService();