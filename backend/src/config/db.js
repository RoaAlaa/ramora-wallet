const mongoose = require('mongoose');
require('dotenv').config(); // Ensure environment variables are loaded

const connectDB = async () => {
  try {
    // Use the DB_URI from your .env file
    const conn = await mongoose.connect(process.env.DB_URI, {
      // Options to avoid deprecation warnings (might vary slightly by Mongoose version)
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000
      // useCreateIndex: true, // No longer needed in Mongoose 6+
      // useFindAndModify: false, // No longer needed in Mongoose 6+
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`); // Log success on connection

    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000); // Attempt to reconnect after 5 seconds
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure if connection fails
  }
};

module.exports = connectDB; // Export the function to be used in server.js
