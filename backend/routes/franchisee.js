const express = require('express');
const router = express.Router();
const franchiseeController = require('../controllers/franchiseeController');

router.post('/login', franchiseeController.login);
router.get('/profile', franchiseeController.getProfile);
router.post('/addSales', franchiseeController.addSales);
router.post('/getSales', franchiseeController.getSales);

module.exports = router;
