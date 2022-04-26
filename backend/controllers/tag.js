const Tag = require('../models/tag');
const Blog = require('../models/blog');
// package to convert words with space ex: my tag to my-tag
const slugify = require('slugify');
const {errorHandler} = require('../helpers/dbErrorHandler');

// create tag
exports.create = (req, res) => {
   // get name field value from request body
   const { name } = req.body;
   // convert name to slug
   let slug = slugify(name).toLowerCase();
   // create new category passing the name and slug values
   let tag = new Tag({ name, slug })
   // save the name and slug
   tag.save((err, data) => {
      // if there is error
      if(err) {
         return res.status(400).json({
            error: errorHandler(err)
         })
      }
      // if no error
      res.json(data);

   })
}

// get list tag
exports.list = (req, res) => {
   Tag.find({}).exec((err, data) => {
      if(err) {
         return res.status(400).json({
            error: errorHandler(err)
         })
      };
      res.json(data)
   })
}

// get single tag
exports.read = (req, res) => {
   // get slug value from :/slug params and convert to lowercase
   const slug = req.params.slug.toLowerCase();
   // findOne based on slug
   Tag.findOne({slug}).exec((err, tag) => {
      if(err) {
         return res.status(400).json({
            error: errorHandler(err)
         })
      };
      // res.json(tag)
      Blog.find({ tags: tag }) // will return all the blog with that tag
      .populate('categories', '_id name slug') // return fields
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name')
      .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
      .exec((err, data) => {
         if(err) {
            return res.status(400).json({
               error: errorHandler(err)
            })
         }
         res.json({ tag: tag, blogs: data});
      })
   })
}

// remove tag
exports.remove = (req, res) => {
   // get slug value from :/slug params and convert to lowercase
   const slug = req.params.slug.toLowerCase();
   // find and remove based on slug
   Tag.findOneAndRemove({slug}).exec((err, data) => {
      if(err) {
         return res.status(400).json({
            error: errorHandler(err)
         })
      };
      res.json({
         message: 'Tag deleted successfully'
      })
   })
}