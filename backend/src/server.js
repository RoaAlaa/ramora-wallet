require('dotenv').config(); 
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5001; 


// app.use('/api/users', userRoutes);  chatgpt 3amlha kda msh 3arf leeh
app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});