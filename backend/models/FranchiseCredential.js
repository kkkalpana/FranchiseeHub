const mongoose = require('mongoose');

// Using typo 'credentails' to match existing database
const franchiseCredentialSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dof: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  collection: 'franchise_credentails' // Intentional typo
});

module.exports = mongoose.model('FranchiseCredential', franchiseCredentialSchema);
