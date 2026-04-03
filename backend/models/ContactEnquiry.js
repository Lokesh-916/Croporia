const mongoose = require('mongoose');
const contactEnquirySchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing', required: true },
  buyerName: { type: String, required: true },
  buyerPhone: { type: String, required: true },
  message: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('ContactEnquiry', contactEnquirySchema);
