// models
const Category = require('../models/category');
const Blog = require('../models/blog');
// package to convert words with space ex: my category to my-category
const slugify = require('slugify');
const {errorHandler} = require('../helpers/dbErrorHandler');

// create category
exports.create = (req, res) => {
   // get name field value from request body
   const { name } = req.body;
   // convert name to slug
   let slug = slugify(name).toLowerCase();
   // create new category passing the name and slug values
   let category = new Category({ name, slug })
   // save the name and slug
   category.save((err, data) => {
      // if there is error
      if(err) {
         return res.status(400).json({
            error: errorHandler(err)
         })
      }
      // if no error
      res.json(data); // category.data 

      // if you do it like res.json ( { category: data } ) in front end you need to access data by category.category.data

   })
}

// get list category
exports.list = (req, res) => {
   Category.find({}).exec((err, data) => {
      if(err) {
         return res.status(400).json({
            error: errorHandler(err)
         })
      };
      res.json(data)
   })
}

// get single category
exports.read = (req, res) => {
   // get slug value from :/slug params and convert to lowercase
   const slug = req.params.slug.toLowerCase();
   // findOne based on slug
   Category.findOne({slug}).exec((err, category) => {
      if(err) {
         return res.status(400).json({
            error: errorHandler(err)
         })
      };
      // res.json(category) // not only to return category but to return blog associated to this categories
      // find all blog based on category
      Blog.find({ categories: category }) // will return all the blog with that category
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
         res.json({ category: category, blogs: data})
      })
   })
}

// remove category
exports.remove = (req, res) => {
   // get slug value from :/slug params and convert to lowercase
   const slug = req.params.slug.toLowerCase();
   // find and remove based on slug
   Category.findOneAndRemove({slug}).exec((err, data) => {
      if(err) {
         return res.status(400).json({
            error: errorHandler(err)
         })
      };
      res.json({
         message: 'Category deleted successfully'
      })
   })
}