const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const config = require('./config/config');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://franchiseehub.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// MongoDB connection
mongoose.connect(config.mongodb.uri)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
const adminRoutes = require('./routes/admin');
const applicantRoutes = require('./routes/applicant');
const franchiseeRoutes = require('./routes/franchisee');

app.use('/admin', adminRoutes);
app.use('/applicant', applicantRoutes);
app.use('/franchisee', franchiseeRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'FranchiseHub V2 API is running' });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
