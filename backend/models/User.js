const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['Farmer', 'Expert'], default: 'Farmer' },
  expertDetails: {
    specialization: { type: String, default: '' },
    region: { type: String, default: '' },
    experience: { type: String, default: '' },
    crops: { type: String, default: '' },
    languages: { type: [String], default: [] },
    rating: { type: Number, default: 5.0 },
    achievements: { type: [String], default: [] }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
