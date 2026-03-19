const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorRole: {
    type: String,
    enum: ['Farmer', 'Expert'],
    default: 'Farmer',
  },
  content: {
    type: String,
    required: true,
  },
  cropTag: {
    type: String,
    required: false,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Post', postSchema);
