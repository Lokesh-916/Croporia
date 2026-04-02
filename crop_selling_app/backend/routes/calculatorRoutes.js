const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

router.post('/hold-vs-sell', calculatorController.calculateHoldVsSell);

module.exports = router;
