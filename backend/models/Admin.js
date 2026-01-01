const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, default: 'admin' }
}, { 
  timestamps: true,
  collection: 'admins'
});

module.exports = mongoose.model('Admin', adminSchema);
