require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const YAML = require('yamljs');
const path = require('path');


const app = express();


const swaggerDocument = YAML.load(path.join(__dirname, '..', 'api-docs', 'swagger.yaml'));


const PORT = process.env.PORT || 5001; 
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true,
}));
app.use(express.json());
const userRoutes = require('./routes/userRoute');
const bucketRoutes = require('./routes/bucketsRoute');
const walletRoutes = require('./routes/walletRoutes');
// Connect to MongoDB
connectDB();

app.use('/api-docs', require('swagger-ui-express').serve, require('swagger-ui-express').setup(swaggerDocument));


app.use('/api/users', userRoutes);
app.use('/api/buckets', bucketRoutes); 
app.use('/api/wallet', walletRoutes); 

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});