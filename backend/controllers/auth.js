const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const Blog = require('../models/blog');
// helpers
const errorHandler = require('../helpers/dbErrorHandler');

// give user information or profile
exports.read = (req, res) => {
   req.profile.hashed_password = undefined;
   return res.json(req.profile);
}

// signup
exports.signup = (req, res) => {
   User.findOne({ email: req.body.email }).exec((err, user) => {
      if(user) {
         return res.status(400).json({
            error: "Email is taken"
         })
      }

      const {name, email, password} = req.body
      let username = shortId.generate()
      let profile = `${process.env.CLIENT_URL}/profile/${username}`

      let newUser = new User({ name, email, password, profile, username })
      newUser.save((err, success) => {
         if(err) {
            return res.status(400).json({
               error: err
            })
         }
         // res.json({
         //    user: success
         // })
         res.json({
            message: 'Signup success! Please signin'
         })
      })

   })
}

// signin
exports.signin = (req, res) => {
   const { email, password } = req.body
   // check if user exist
   User.findOne({ email }).exec((err, user) => {
      if(err || !user) {
         return res.status(400).json({
            error: "User with that email does not exist. Please signup."
         })
      }
      // authenticate
      if(!user.authenticate(password)) {
         return res.status(400).json({
            error: "Email and password do not match."
         })
      }
      // generate a token and send to client
      const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.cookie('token', token, {expiresIn: '1d'})
      const { _id, username, name, email, role}  = user
      return res.json({
         token,
         user: { _id, username, name, email, role} 
      });
   });
};

// signout
exports.signout = (req, res) => {
   res.clearCookie('token');
   res.json({
       message: 'Signout success'
   });
};


exports.requireSignin = expressJwt({
   secret: process.env.JWT_SECRET,
   algorithms: ['HS256'], // added later
   userProperty: 'user'
});

// auth middleware
exports.authMiddleware = (req, res, next) => {
   console.log(req.user)
   const authUserId = req.user._id
   User.findById({ _id: authUserId}).exec((err, user) => {
      if(err || !user) {
         return res.status(400).json({
            error: 'User not found'
         })
      }
      req.profile = user
      next();
   }
   )
}

// admin middleware
exports.adminMiddleware = (req, res, next) => {
   const adminUserId = req.user._id;
   User.findById({_id: adminUserId}).exec((err, user) => {
      if(err || !user) {
         return res.status(400).json({
            error: 'User not found'
         });
      }

      // check role, if not admin
      if(user.role !== 1) {
         return res.status(400).json({
            error: 'Admin resource. Access denied'
         });
      }

      req.profile = user;
      next();
   }
   )
}

// user auth can update and delete blogs
exports.canUpdateDeleteBlogs = (req, res, next) => {
   const slug = req.params.slug.toLowerCase();
   // find blog based on slug
   Blog.findOne({slug}).exec((err, data) => {
      if(err) {
         return res.status(400).json({
            error: errorHandler(err)
         })
      }
      // compare blog postedBy id to user profile id - true or false
      let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString();
      if(!authorizedUser) {
         return res.status(400).json({
            error: 'You are not authorized'
         })
      }
      next(); // execute next step
   })

}