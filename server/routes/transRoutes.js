const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction } = require('../controllers/transController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/transactions
// @desc    Get all transactions for a user 
router.get('/', auth, getTransactions);

// @route   POST api/transactions
// @desc    Add a new transaction
router.post('/', auth, addTransaction);

module.exports = router;