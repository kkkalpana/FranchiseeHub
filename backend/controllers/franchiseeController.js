const FranchiseCredential = require('../models/FranchiseCredential');
const Applicant = require('../models/Applicant');
const SalesData = require('../models/SalesData');

// Franchisee login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const franchisee = await FranchiseCredential.findOne({ email, password });
    
    if (franchisee) {
      req.session.franchiseeEmail = email;
      req.session.userType = 'franchisee';
      res.json({ stat: true, msg: 'Login successful' });
    } else {
      res.json({ stat: false, msg: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Franchisee login error:', error);
    res.status(500).json({ stat: false, msg: error.message });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const email = req.session.franchiseeEmail;
    if (!email) {
      return res.status(401).json({ stat: false, msg: 'Not authenticated' });
    }
    
    const profile = await Applicant.findOne({ email });
    res.json({ stat: true, profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ stat: false, msg: error.message });
  }
};

// Add sales
exports.addSales = async (req, res) => {
  try {
    const { email, dos, revenue } = req.body;
    
    const salesDate = new Date(dos);
    salesDate.setHours(0, 0, 0, 0);
    
    // Check if exists
    const existing = await SalesData.findOne({ email, dos: salesDate });
    
    if (existing) {
      existing.revenue = revenue;
      await existing.save();
      return res.json({ stat: true, msg: 'Sales updated' });
    }
    
    // Create new
    const salesData = new SalesData({
      email,
      dos: salesDate,
      revenue
    });
    
    await salesData.save();
    res.json({ stat: true, msg: 'Sales added' });
  } catch (error) {
    console.error('Error adding sales:', error);
    res.status(500).json({ stat: false, msg: error.message });
  }
};

// Get sales
exports.getSales = async (req, res) => {
  try {
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
