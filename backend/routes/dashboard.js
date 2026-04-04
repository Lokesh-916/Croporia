const express = require('express');
const DashboardData = require('../models/DashboardData');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET — load all dashboard data for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    let doc = await DashboardData.findOne({ userId: req.user.id });
    if (!doc) doc = await DashboardData.create({ userId: req.user.id });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// PUT — save all dashboard data for user
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { fields, expenses, yields, loans, diary, tasks } = req.body;
    const doc = await DashboardData.findOneAndUpdate(
      { userId: req.user.id },
      { fields, expenses, yields, loans, diary, tasks, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save dashboard data' });
  }
});

module.exports = router;
