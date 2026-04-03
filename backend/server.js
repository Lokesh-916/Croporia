require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length) { console.error(`Missing required env vars: ${missing.join(', ')}`); process.exit(1); }

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/fields', require('./routes/fields'));
app.use('/api/community', require('./routes/community'));
app.use('/api/experts', require('./routes/experts'));
app.use('/api/market/listings', require('./routes/listings'));
app.use('/api/market/contact', require('./routes/contact'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'croporia-node-api', port: PORT }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Croporia Node API running on port ${PORT}`));
  })
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });
