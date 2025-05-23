const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const connectDB = async () => {
  try {
    if (!process.env.DB_URI) {
      throw new Error('DB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.DB_URI, {
      // Options to avoid deprecation warnings (might vary slightly by Mongoose version)
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      connectTimeoutMS: 30000
      // useCreateIndex: true, // No longer needed in Mongoose 6+
      // useFindAndModify: false, // No longer needed in Mongoose 6+
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`); // Log success on connection
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure if connection fails
  }
};

module.exports = connectDB; // Export the function to be used in server.js
