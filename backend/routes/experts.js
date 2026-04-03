const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const experts = await User.find({ role: 'Expert' }).select('-password_hash');
    res.json(experts);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch experts' }); }
});

module.exports = router;
