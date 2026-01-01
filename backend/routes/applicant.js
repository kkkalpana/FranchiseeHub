const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/applicantController');

router.post('/apply', applicantController.submitApplication);

module.exports = router;
