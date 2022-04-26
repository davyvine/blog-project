const express = require('express');
const router = express.Router();
// controllers
const { create, list, listAllBlogsCategoriesTags, read, remove, update, photo, listRelated, listSearch,listByUser } 
= require('../controllers/blog');
// middlewares
const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlogs } = require('../controllers/auth'); 


// middlware will be used to check authenticated logged in user and is admin to create blog
router.post('/blog', requireSignin, adminMiddleware, create); // create new blog to /blog endpoint
router.get('/blogs', list) // list all blogs
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags) // using post method - get all blogs with list of categories and tags to send more additional data and send queries
router.get('/blog/:slug', read) // get single blog
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove) //  delete blog
router.put('/blog/:slug', requireSignin, adminMiddleware, update) //  update blog
router.get('/blog/photo/:slug', photo) // get blog photo
router.post('/blogs/related', listRelated) // get related blogs
router.get('/blogs/search', listSearch) // search blog

// auth user blog crud - same as admin only change middlware to authMiddleware
router.post('/user/blog', requireSignin, authMiddleware, create); // create new blog 
router.get('/:username/blogs', listByUser) // get list of blogs of auth user
router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlogs, remove) //  delete blog
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlogs,  update) //  update blog

module.exports = router;