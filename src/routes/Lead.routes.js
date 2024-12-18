const express = require('express');
const router = express.Router();
const emailController = require('../controllers/Lead.controller')


router.get('mailer', emailController.registerNewLead);