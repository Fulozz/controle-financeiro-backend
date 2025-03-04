const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/Transaction.controller')
const auth  = require('../middleware/Auth.middleware')


router.post('/transaction/register', auth, transactionController.registerNewTransaction);
/**
 * @route POST /transaction/register
 * @description Route responsible for creating a new 'Transaction'
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

router.post('/transaction/register/recurring', auth, transactionController.registerRecurringTransaction);
/**
 * @route POST /transaction/register/recurring
 * @description Route responsible for creating a new recurring 'Transaction'
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

router.post('/transaction/register/installments', auth,transactionController.registerNewInstallments);
/**
 * @route POST /transaction/register/installments
 * @description Route responsible for creating a new installments 'Transaction'
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

router.get('/transaction/finances/:userID/:mesRef', auth, transactionController.getFinancialReport);
/**
 * @route GET /transaction/finances/:userID/:mesRef
 * @description Route responsible for getting the financial report for a user by month
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

router.get('/transaction/finances/report/:userId', auth, transactionController.getFinancialReportByUser)
/**
 * @route GET /transaction/finances/report/:userID
 * @description Route responsible for getting the financial report for a user
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

router.get('/transaction/finances/recent/:userID', auth, transactionController.getTransactions);
/**
 * @route GET /transaction/finances/recent/:userID
 * @description Route responsible for getting recent transactions by month for a user
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

router.get('/transaction/recurring/:userID', auth, transactionController.getRecurringTransactionsByUser);

/**
 * @route GET /transaction/recurring/:userID
 * @description Route responsible for getting recurring transactions by user
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */


module.exports = router;