const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fields: { type: Array, default: [] },
  expenses: { type: Array, default: [] },
  yields: { type: Array, default: [] },
  loans: { type: Array, default: [] },
  diary: { type: Array, default: [] },
  tasks: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DashboardData', dashboardSchema);
