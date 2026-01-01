const mongoose = require('mongoose');

const salesDataSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  dos: { type: Date, required: true },
  revenue: { type: Number, required: true }
}, { 
  timestamps: true,
  collection: 't_sales_data'
});

salesDataSchema.index({ email: 1, dos: 1 });

module.exports = mongoose.model('SalesData', salesDataSchema);
