const submitFeedback = async (req, res) => {
  try {
    const { name, message } = req.body;

    // Validate feedback input
    if (!name || !message || typeof name !== 'string' || typeof message !== 'string' || name.trim() === '' || message.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Name and feedback are required and must be non-empty strings' 
      });
    }

    const feedbackModel = require('../models/Feedback.model');
    const newFeedback = new feedbackModel({ name, message });
    await newFeedback.save();

    res.status(201).json({ 
      success: true, 
      message: 'Feedback received successfully' 
    });
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting feedback', 
      error: error.message 
    });
  }
};
module.exports = {
  submitFeedback
};
