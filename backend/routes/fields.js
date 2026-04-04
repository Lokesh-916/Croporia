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

// @route   PUT /api/fields/:id
// @desc    Update a field
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const field = await Field.findOne({ _id: req.params.id, userId: req.user.id });
    if (!field) return res.status(404).json({ error: 'Field not found' });
    const { name, area, location, soilDetails, waterSource, cropPlans, notes } = req.body;
    if (name) field.name = name;
    if (area) field.area = area;
    if (location !== undefined) field.location = location;
    if (soilDetails) field.soilDetails = soilDetails;
    if (waterSource !== undefined) field.waterSource = waterSource;
    if (cropPlans) field.cropPlans = cropPlans;
    if (notes !== undefined) field.notes = notes;
    const saved = await field.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating field' });
  }
});

// @route   DELETE /api/fields/:id
// @desc    Delete a field
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const field = await Field.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!field) return res.status(404).json({ error: 'Field not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting field' });
  }
});

module.exports = router;
