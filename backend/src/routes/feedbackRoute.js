/**
 * Feedback routes
 */
const express = require('express');
const router = express.Router();
const { submitFeedback } = require('../controllers/feedbackController');


// POST route for submitting feedback
router.post('/', submitFeedback);

module.exports = router;

