// backend/src/models/Transaction.model.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Sender is required'],
      ref: 'User',
      index: true // Add index for better query performance
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Receiver is required'],
      ref: 'User',
      index: true // Add index for better query performance
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [0.01, 'Amount must be at least 0.01'],
      validate: {
        validator: function(v) {
          return v > 0;
        },
        message: 'Transaction amount must be positive'
      }
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: ['send', 'request', 'deposit'], // Added 'deposit' as a valid type
      index: true
    },
    status: {
      type: String,
      required: [true, 'Transaction status is required'],
      enum: ['pending', 'completed', 'rejected'],
      default: 'pending',
      index: true
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Note cannot be more than 200 characters']
    },
    reference: {
      type: String,
      unique: true,
      sparse: true // Allows null/undefined values
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add compound index for common queries
transactionSchema.index({ sender: 1, status: 1 });
transactionSchema.index({ receiver: 1, status: 1 });
transactionSchema.index({ createdAt: -1 }); // For sorting by date

// Virtual for transaction duration
transactionSchema.virtual('duration').get(function() {
  if (this.status === 'completed' && this.updatedAt && this.createdAt) {
    return this.updatedAt - this.createdAt;
  }
  return null;
});

// Pre-save middleware to generate reference if not provided
transactionSchema.pre('save', function(next) {
  if (!this.reference) {
    this.reference = `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Static method to find transactions by user
transactionSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [{ sender: userId }, { receiver: userId }]
  }).sort({ createdAt: -1 });
};

// Create and export the Transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;

