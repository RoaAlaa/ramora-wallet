const mongoose = require('mongoose');
require('dotenv').config(); // Ensure environment variables are loaded

const connectDB = async () => {
  try {
    // Use the DB_URI from your .env file
    const conn = await mongoose.connect(process.env.DB_URI, {
      // Options to avoid deprecation warnings (might vary slightly by Mongoose version)
      useNewUrlParser: true,
      useUnifiedTopology: true,
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