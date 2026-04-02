const mongoose = require('mongoose');
const ContactEnquiry = require('../models/ContactEnquiry');

// In-memory fallback dataset
let memoryEnquiries = [];

exports.createEnquiry = async (req, res) => {
  try {
    const { listingId, buyerName, buyerPhone, message } = req.body;

    // IF MongoDB is not connected, use the in-memory array to prevent timeouts
    if (mongoose.connection.readyState !== 1) {
      const newEnquiry = {
        _id: Math.random().toString(36).substring(2, 10),
        listingId,
        buyerName,
        buyerPhone,
        message,
        createdAt: new Date()
      };
      memoryEnquiries.push(newEnquiry);
      return res.status(201).json(newEnquiry);
    }

    const newEnquiry = new ContactEnquiry({
      listingId,
      buyerName,
      buyerPhone,
      message
    });

    await newEnquiry.save();
    res.status(201).json(newEnquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
