// backend/src/models/User.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Define the schema for the embedded buckets
const bucketSchema = new mongoose.Schema({
  // bucketId is automatically created by mongoose as _id for subdocuments
  name: {
    type: String,
    required: [true, 'Bucket name is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true, // Ensure usernames are unique
      trim: true,   // Remove leading/trailing whitespace
      lowercase: true, // Store username in lowercase
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Ensure emails are unique
      trim: true,
      lowercase: true, // Store email in lowercase
      match: [ // Basic email format validation
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^\+?[1-9]\d{1,14}$/, // Basic phone number validation (E.164 format)
        'Please provide a valid phone number'
      ]
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    },
    // We define 'password', but store the hash. Hashing happens in the pre-save hook below.
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'], // Example validation
    },
    balance: {
      type: Number,
      required: true,
      default: 0, // Start users with a balance of 0
    },
    // Embed the bucket schema as an array
    buckets: [bucketSchema],
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Middleware (pre-save hook) to hash password BEFORE saving a user document
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10); // 10 rounds is generally recommended
    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware/error handler
  }
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' refers to the hashed password stored in the document
  return await bcrypt.compare(enteredPassword, this.password);
};


// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;