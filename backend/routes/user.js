const express = require('express');
const router = express.Router();
const { requireSignin, authMiddleware } = require('../controllers/auth');
const { read, publicProfile, update, photo} = require('../controllers/user');



// routes
router.get('/user/profile', requireSignin, authMiddleware , read); // profile
router.get('/user/:username', publicProfile); // user public profile
router.put('/user/update', requireSignin, authMiddleware, update); // user update profile
router.get('/user/photo/:username', photo); // get user profile photo


module.exports = router;