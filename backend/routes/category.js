const express = require('express');
const router = express.Router();

// controllers
const { create, list, read, remove } = require('../controllers/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

// validators
const { runValidation } = require('../validators');
const{ categoryCreateValidator } = require('../validators/category');

// routes
router.post('/category', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, create); // create category
router.get('/categories', list); // get all categories
router.get('/category/:slug', read); // get single category
router.delete('/category/:slug',requireSignin, adminMiddleware, remove); // delete category - delete word is reserve in js 


module.exports = router;   