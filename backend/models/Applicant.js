const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: String,
  res_address: String,
  buis_name: String,
  site_address: String,
  site_city: String,
  site_postal: String,
  area_sqft: String,
  site_floor: String,
  ownership: String,
  doa: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
}, { 
  timestamps: true,
  collection: 'applicants',
  strict: false
});

module.exports = mongoose.model('Applicant', applicantSchema);
