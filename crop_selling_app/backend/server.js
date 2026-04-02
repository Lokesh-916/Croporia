require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://fakeuser:fakepassword@cluster0.mongodb.net/agritech?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Models configuration check
require('./models/CropListing');
require('./models/ContactEnquiry');

// Routes imports
const listingRoutes = require('./routes/listingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');

// Basic route
app.get('/', (req, res) => {
  res.send('Agritech API is running...');
});

// API Routes
app.use('/api/listings', listingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/calculator', calculatorRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
