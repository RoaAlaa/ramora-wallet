const Joi = require('joi');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message
            });
        }
        next();
    };
};

// Validation schemas
const schemas = {
    register: Joi.object({
        name: Joi.string().required().min(2).max(50),
        username: Joi.string().required().min(3).max(30),
        email: Joi.string().required().email(),
        phoneNumber: Joi.string().required().pattern(/^\+?[1-9]\d{1,14}$/),
        password: Joi.string().required().min(6)
    }),

    login: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    }),

    updateProfile: Joi.object({
        name: Joi.string().min(2).max(50),
        phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/)
    }),

    updatePassword: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().required().min(6)
    }),

    createTransaction: Joi.object({
        receiverId: Joi.string().required(),
        amount: Joi.number().required().min(0.01),
        type: Joi.string().required().valid('send', 'request'),
        note: Joi.string().max(200)
    }),

    updateTransactionStatus: Joi.object({
        status: Joi.string().required().valid('pending', 'completed', 'rejected')
    }),

    addBucket: Joi.object({
        name: Joi.string().required().min(2).max(50),
        amount: Joi.number().required().min(0)
    }),

    updateBucket: Joi.object({
        name: Joi.string().min(2).max(50),
        amount: Joi.number().min(0)
    }),

    updateBalance: Joi.object({
        amount: Joi.number().required()
    }),

    searchTransactions: Joi.object({
        query: Joi.string().max(200),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso().min(Joi.ref('startDate')),
        minAmount: Joi.number().min(0.01),
        maxAmount: Joi.number().min(0.01).min(Joi.ref('minAmount')),
        type: Joi.string().valid('send', 'request'),
        status: Joi.string().valid('pending', 'completed', 'rejected')
    })
};

module.exports = {
    validateRequest,
    schemas
}; 