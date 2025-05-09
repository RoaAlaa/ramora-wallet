require('dotenv').config({ path: '../.env' }); 
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

// Connect to MongoDB
connectDB();

app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});