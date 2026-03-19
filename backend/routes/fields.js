const express = require('express');
const Field = require('../models/Field');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/fields
// @desc    Get all fields for the logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const fields = await Field.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching fields' });
  }
});

// @route   POST /api/fields
// @desc    Register a new field
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, area, location, soilDetails, cropPlans } = req.body;

    const newField = new Field({
      userId: req.user.id,
      name,
      area,
      location,
      soilDetails,
      cropPlans
    });

    const savedField = await newField.save();
    res.status(201).json(savedField);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving field' });
  }
});

module.exports = router;
