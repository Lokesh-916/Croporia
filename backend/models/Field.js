const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  area: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['Acres', 'Hectares', 'Square Meters'], default: 'Acres' }
  },
  location: {
    type: String,
    required: true,
  },
  soilDetails: {
    type: { type: String },
    ph: { type: Number },
    nitrogen: { type: Number },
    phosphorus: { type: Number },
    potassium: { type: Number }
  },
  cropPlans: [{
    cropName: String,
    status: { type: String, enum: ['Planned', 'Sowed', 'Harvested'], default: 'Planned' },
    sowDate: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Field', fieldSchema);
