const UserService = require('../services/UserService');
const bcrypt = require('bcrypt');
const emailServices = require('../services/MailServices');

exports.register = async (req, res) => {
    try {
        const { name, username, email, phoneNumber, password } = req.body;
        const result = await UserService.register(name, username, email, phoneNumber, password);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        await emailServices.sendEmail(result.user.email, 'welcome to our app', `Hi ${result.user.name}, thank you for registering!`);
        res.status(201).json({
            message: 'User registered successfully',
            user: result.user,
            token: result.token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await UserService.login(username, password);

        if (!result.success) {
            return res.status(401).json({ error: result.error });
        }

        res.status(200).json({
            message: 'Login successful',
            user: result.user,
            token: result.token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const result = await UserService.getUserById(req.user._id);
        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }
        res.status(200).json({
            success: true,
            user: result.user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await UserService.getUserById(userId);
        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }

        res.status(200).json({
            success: true,
            user: result.user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;

        // Don't allow updating email or username
        delete updates.email;
        delete updates.username;

        // // If password is being updated, hash it
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const result = await UserService.updateUser(userId, updates);
        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }

        res.status(200).json({
            success: true,
            user: result.user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res)=>{
    try{
        const userId = req.params.userId;
        const result = await UserService.deleteUser(userId);
        if (!result.success)
        {
            return res.status(404).json({error: result.error});
        }

        await emailServices.sendEmail(result.user.email, 'Account has been deleted', `Hi ${result.user.name},We're writing to confirm that your account has been successfully`);
        res.status(201).json({
            message: 'User deleted successfully',
            user: result.user,
            token: result.token
        });

        res.status(200).json({
            success : true,
            deletedUser: result.deletedUser
        });
    }
    catch(error)
    {
        res.status(500).json({error: error.message});
    }

};
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const result = await UserService.searchUsers(query);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json({
            success: true,
            users: result.users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register: exports.register,
    login: exports.login,
    getMe: exports.getMe,
    getUserById: exports.getUserById,
    updateUser: exports.updateUser,
    deleteUser: exports.deleteUser,
    searchUsers: exports.searchUsers
};