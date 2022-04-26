const express = require('express');
const router = express.Router();

// controllers
const { create, list, read, remove } = require('../controllers/tag');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

// validators
const { runValidation } = require('../validators');
const{ tagCreateValidator } = require('../validators/tag');

// routes
router.post('/tag', tagCreateValidator, runValidation, requireSignin, adminMiddleware, create); // create tag
router.get('/tags', list); // get all tag
router.get('/tag/:slug', read); // get single tag
router.delete('/tag/:slug',requireSignin, adminMiddleware, remove); // delete tag - delete word is reserve in js 


module.exports = router;   
