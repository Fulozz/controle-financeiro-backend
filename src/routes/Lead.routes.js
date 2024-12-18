const express = require('express');
const router = express.Router();
const leadController = require('../controllers/Lead.controller')

// ==> Rota responsavel por criar o novo 'Lead': (POST) localhost:3000/api/v1/mailer
router.post('/mailer', leadController.registerNewLead);

module.exports = router