const UserService = require('../services/UserService');

exports.register = async (req,res) =>{
    try{
        const {user, token} = await UserService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
            token
        });
    }
    catch (error){
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.login = async (req, res) => {
    try{
        const {user, token} = await UserService.login(req.body);
        res.status(200).json({
            message: 'user login successfully',
            success: true,
            user,
            token
        });
    }
    catch (error){
        res.status(400).json({ error: error.message, success: false });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await UserService.getUserProfile(req.user._id);
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const user = await UserService.updateUserProfile(req.user._id, req.body);
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Please provide both current and new password'
            });
        }

        const user = await UserService.updatePassword(req.user._id, currentPassword, newPassword);
        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.addBucket = async (req, res) => {
    try {
        const bucket = await UserService.addBucket(req.user._id, req.body);
        res.status(201).json({
            success: true,
            message: 'Bucket added successfully',
            bucket
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateBucket = async (req, res) => {
    try {
        const bucket = await UserService.updateBucket(req.user._id, req.params.bucketId, req.body);
        res.status(200).json({
            success: true,
            message: 'Bucket updated successfully',
            bucket
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteBucket = async (req, res) => {
    try {
        await UserService.deleteBucket(req.user._id, req.params.bucketId);
        res.status(200).json({
            success: true,
            message: 'Bucket deleted successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateBalance = async (req, res) => {
    try {
        const user = await UserService.updateBalance(req.user._id, req.body.amount);
        res.status(200).json({
            success: true,
            message: 'Balance updated successfully',
            balance: user.balance
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getUserBuckets = async (req, res) => {
    try {
        const buckets = await UserService.getUserBuckets(req.user._id);
        res.json({
            success: true,
            data: buckets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getBalanceHistory = async (req, res) => {
    try {
        const history = await UserService.getBalanceHistory(req.user._id);
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const stats = await UserService.getUserStats(req.user._id);
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