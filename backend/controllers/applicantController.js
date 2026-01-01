const Applicant = require('../models/Applicant');

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    const {
      fname, lname, email, phone, res_address, buis_name,
      site_address, site_city, site_postal, area_sqft, site_floor, ownership
    } = req.body;
    
    // Check if exists
    const existing = await Applicant.findOne({ email });
    if (existing) {
      return res.json({ stat: false, msg: 'Application already exists' });
    }
    
    // Create application
    const applicant = new Applicant({
      fname, lname, email, phone, res_address, buis_name,
      site_address, site_city, site_postal, area_sqft, site_floor, ownership,
      status: 'pending',
      doa: new Date()
    });
    
    await applicant.save();
    res.json({ stat: true, msg: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ stat: false, msg: error.message });
  }
};

module.exports = exports;
