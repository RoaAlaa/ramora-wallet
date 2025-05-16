require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; 
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true,
}));
app.use(express.json());
const userRoutes = require('./routes/userRoute');
const bucketRoutes = require('./routes/bucketsRoute');
const walletRoutes = require('./routes/walletRoutes');
const feedbackRoute = require('./routes/feedbackRoute');

// Connect to MongoDB
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/buckets', bucketRoutes); 
app.use('/api/wallet', walletRoutes); 
app.use('/api/feedback', feedbackRoute);

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 

