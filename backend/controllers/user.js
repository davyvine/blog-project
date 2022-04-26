const User = require('../models/user');
const Blog = require('../models/blog');
// helpers
const errorHandler = require('../helpers/dbErrorHandler');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

// give user information or profile
exports.read = (req, res) => {
   req.profile.hashed_password = undefined;
   return res.json(req.profile);
}

// get public profile
exports.publicProfile = (req, res) => {
   // extract username
   let username = req.params.username;
   // initialize variables
   let user;
   let blogs;

   // find the user
   User.findOne({username}).exec((err, userFromDB) => {
      if(err || !userFromDB) {
         return res.status(400).json({
            error: 'User not found'
         })
      }

      // if user is found - populate user var
      user = userFromDB;
      let userId = user._id;
      
      // Find Blog
      Blog.find({postedBy: userId})
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name')
      .limit(10)
      .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
      .exec((err, data) => {
         if(err) {
            return res.status(400).json({
               error: errorHandler(err)
            })
         }
         user.photo = undefined; // set photo to undefined 
         user.hashed_password = undefined; // do not return
         res.json({
            user,
            blogs: data
         })
      })
      
   })
}

// update profile
exports.update = (req, res) => {
   let form = new formidable.IncomingForm();
   form.keepExtension = true;
   form.parse(req, (err, fields, files) => {
       if (err) {
           return res.status(400).json({
               error: 'Photo could not be uploaded'
           });
       }
       let user = req.profile;
       user = _.extend(user, fields);

       // password validator
       if(fields.password && fields.password.length < 6) {
          return res.status(400).json({
             error: 'Password should be min 6 characters long'
          })
       }

       if (files.photo) {
           if (files.photo.size > 10000000) {
               return res.status(400).json({
                   error: 'Image should be less than 1mb'
               });
           }
           user.photo.data = fs.readFileSync(files.photo.path);
           user.photo.contentType = files.photo.type;
       }

       user.save((err, result) => {
           if (err) {
               return res.status(400).json({
                   error: errorHandler(err)
               });
           }
           user.hashed_password = undefined;
           user.salt = undefined;
           user.photo = undefined;
           res.json(user);
       });
   });
};

// update photo
exports.photo = (req, res) => {
   // get username
   const username = req.params.username;

   //find user 
   User.findOne({username}).exec((err, user) => {
      if(err || !user) {
         return res.status(400).json({
            error: 'User not found'
         })
      }

      if(user.photo.data) {
         res.set('Content-Type', user.photo.contentType);
         return res.send(user.photo.data) // return user photo
      }
   })
}