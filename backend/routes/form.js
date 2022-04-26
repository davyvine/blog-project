const express = require('express');
const router = express.Router();
// controllers
const { contactForm } = require('../controllers/form');
// validators
const { runValidation } = require('../validators');
const{ contactFormValidator } = require('../validators/form');

// routes
router.post('/contact', contactFormValidator, runValidation, contactForm); // contact form route

module.exports = router;   
