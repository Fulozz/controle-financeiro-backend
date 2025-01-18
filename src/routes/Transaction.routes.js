const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/Transaction.controller')
const auth  = require('../middleware/Auth.middleware')

router.post('/transaction/register', transactionController.registerNewTransaction);

router.post('/transaction/register/recurring', transactionController.registerRecurringTransaction);

router.get('/transaction/recurring/:userID', auth, transactionController.getRecurringTransactions);

router.get('/transaction/finances/:userID/:mesRef', auth, transactionController.getFinancialReport);

router.get('/transaction/finances/recent/:userID/:mesRef', auth, transactionController.getTransactionsByMonth);

module.exports = router;