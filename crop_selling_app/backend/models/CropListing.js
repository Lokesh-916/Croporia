const mongoose = require('mongoose');

const cropListingSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Vegetables', 'Fruits', 'Crops', 'Herbs & Spices'],
  },
  cropName: { type: String, required: true },
  pincode: { type: String, required: true, index: true },
  amountKg: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CropListing', cropListingSchema);
