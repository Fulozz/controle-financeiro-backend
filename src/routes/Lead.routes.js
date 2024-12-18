const express = require('express');
const router = express.Router();
const leadController = require('../controllers/Lead.controller')


router.post('mailer', leadController.registerNewLead);

module.exports = router