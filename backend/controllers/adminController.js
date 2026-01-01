const Applicant = require('../models/Applicant');
const FranchiseCredential = require('../models/FranchiseCredential');
const Admin = require('../models/Admin');
const { nanoid } = require('nanoid');

// Admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, password });
    
    if (admin) {
      req.session.adminEmail = email;
      req.session.userType = 'admin';
      res.json({ stat: true, msg: 'Login successful' });
    } else {
      res.json({ stat: false, msg: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ stat: false, msg: error.message });
  }
};

// Get all applicants
exports.getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find().lean().sort({ doa: -1 });
    res.json({ status: true, doc: applicants });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ status: false, msg: error.message });
  }
};

// Accept applicant
exports.acceptApplicant = async (req, res) => {
  try {
    const { email } = req.body;
    await Applicant.updateOne({ email }, { $set: { status: 'accepted' } });
    res.json({ stat: true, msg: 'Applicant accepted' });
  } catch (error) {
    console.error('Error accepting applicant:', error);
    res.status(500).json({ stat: false, msg: error.message });
  }
};

// Reject applicant
exports.rejectApplicant = async (req, res) => {
  try {
    const { email } = req.body;
    await Applicant.updateOne({ email }, { $set: { status: 'rejected' } });
    res.json({ stat: true, msg: 'Applicant rejected' });
  } catch (error) {
    console.error('Error rejecting applicant:', error);
    res.status(500).json({ stat: false, msg: error.message });
  }
};

// Grant franchise
exports.grantApplicant = async (req, res) => {
  try {
    const { email } = req.body;
    await Applicant.updateOne({ email }, { $set: { status: 'granted' } });
    res.json({ stat: true, msg: 'Franchise granted' });
  } catch (error) {
    console.error('Error granting franchise:', error);
    res.status(500).json({ stat: false, msg: error.message });
  }
};

// Create franchise credentials
exports.saveFranchiseCred = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if already exists
    const existing = await FranchiseCredential.findOne({ email });
    if (existing) {
      return res.json({ stat: true, pwd: existing.password, msg: 'Credentials already exist' });
    }
    
    // Generate password
    const pwd = nanoid(10);
    
    // Create credentials
    const credential = new FranchiseCredential({
      email,
      password: pwd,
      dof: new Date()
    });
    
    await credential.save();
    res.json({ stat: true, pwd, msg: 'Credentials created' });
  } catch (error) {
    console.error('Error creating credentials:', error);
    res.status(500).json({ stat: false, msg: error.message });
  }
};

// Get user sales (for admin to view franchisee sales)
exports.getUserSales = async (req, res) => {
  try {
    const SalesData = require('../models/SalesData');
    const { email, start, end } = req.body;
    
    const query = { email };
    
    if (start && end) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      
      query.dos = { $gte: startDate, $lte: endDate };
    }
    
    const salesData = await SalesData.find(query).sort({ dos: -1 });
    res.json({ stat: true, doc: salesData });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ stat: false, msg: error.message });
  }
};

module.exports = exports;
