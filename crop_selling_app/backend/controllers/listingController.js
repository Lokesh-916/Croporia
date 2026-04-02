const mongoose = require('mongoose');
const CropListing = require('../models/CropListing');

// In-memory fallback dataset for when the fake MongoDB URI is used
let memoryListings = [];

exports.createListing = async (req, res) => {
  try {
    const { farmerName, category, cropName, pincode, amountKg, pricePerKg } = req.body;
    
    // Calculate total price automatically
    const totalPrice = amountKg * pricePerKg;

    // IF MongoDB is not connected, use the in-memory array to prevent timeouts
    if (mongoose.connection.readyState !== 1) {
      const newListing = {
        _id: Math.random().toString(36).substring(2, 10),
        farmerName,
        category,
        cropName,
        pincode,
        amountKg,
        pricePerKg,
        totalPrice,
        createdAt: new Date()
      };
      memoryListings.unshift(newListing); // Add to the top
      return res.status(201).json(newListing);
    }

    const newListing = new CropListing({
      farmerName,
      category,
      cropName,
      pincode,
      amountKg,
      pricePerKg,
      totalPrice,
    });

    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { pincode, category } = req.query;
    
    // IF MongoDB is not connected, search the in-memory array
    if (mongoose.connection.readyState !== 1) {
      let filtered = memoryListings;
      if (pincode) {
        filtered = filtered.filter(l => l.pincode === pincode);
      }
      if (category) {
        filtered = filtered.filter(l => l.category === category);
      }
      return res.status(200).json(filtered);
    }

    let filter = {};

    if (pincode) {
      filter.pincode = pincode;
    }
    if (category) {
      filter.category = category;
    }

    const listings = await CropListing.find(filter).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
