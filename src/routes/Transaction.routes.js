const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/Transaction.controller')
const auth  = require('../middleware/Auth.middleware')

router.post('/register', auth, transactionController.registerNewTransaction);

router.get('/finances', auth, transactionController.getFinancialReport);

module.exports = router;