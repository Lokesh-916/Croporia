const express = require('express');
const router = express.Router();
const CropListing = require('../models/CropListing');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) { try { req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET); } catch {} }
  next();
}

router.post('/', optionalAuth, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Login required to post a listing' });
  try {
    const { farmerName, category, cropName, pincode, amountKg, pricePerKg } = req.body;
    const listing = new CropListing({ farmerName, userId: req.user.id, category, cropName, pincode, amountKg, pricePerKg, totalPrice: amountKg * pricePerKg });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const { pincode, category } = req.query;
    const filter = {};
    if (pincode) filter.pincode = pincode;
    if (category) filter.category = category;
    const listings = await CropListing.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(listings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', optionalAuth, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Login required' });
  try {
    const listing = await CropListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.userId && listing.userId !== req.user.id) return res.status(403).json({ error: 'Not your listing' });
    await listing.deleteOne();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
