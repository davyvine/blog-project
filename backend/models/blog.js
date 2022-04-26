const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema({
   title: { //blog title
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true
   },
   slug: { // blog slug
      type: String,
      unique: true,
      index: true
   },
   body: { // blog content
      type: {},
      required: true,
      min: 200,
      max: 2000000 //in kb = 2mb max allowed size
   },
   excerpt: { // summary content of blog
      type: String,
      max: 1000
   },
   mtitle: { // meta title important in seo or search engine optimization
      type: String
   },
   mdesc: { // meta description important in seo or search engine optimization
      type: {}
   },
   photo: {
      data: Buffer,
      contentType: String
   },
   categories: [
      {
         type: ObjectId,
         ref:'Category', // reference to Category model
         required: true
      }
   ],
   tags: [
      {
         type: ObjectId,
         ref:'Tag', // reference to Tag model
         required: true
      }
   ],
   postedBy: {
      type: ObjectId,
      ref: 'User' // refer to User model
   }
}, 
   { timestamps: true } 
);

module.exports = mongoose.model('Blog', blogSchema);