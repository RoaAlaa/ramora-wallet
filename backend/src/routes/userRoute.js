const express = require('express');
const router = express.Router();

const {register, login, getMe, getUserById, updateUser} = require('../controllers/userController');
const {protect} = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/:userId', protect, getUserById);
router.put('/:userId', protect, updateUser);

module.exports = router;