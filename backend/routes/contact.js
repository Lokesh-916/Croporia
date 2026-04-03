const express = require('express');
const router = express.Router();
const ContactEnquiry = require('../models/ContactEnquiry');

router.post('/', async (req, res) => {
  try {
    const { listingId, buyerName, buyerPhone, message } = req.body;
    const enquiry = new ContactEnquiry({ listingId, buyerName, buyerPhone, message });
    await enquiry.save();
    res.status(201).json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
