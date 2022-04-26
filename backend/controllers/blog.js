// model
const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const User = require('../models/user');
// import formidable to handle form data which is not json
const formidable = require('formidable');
// generate slug
const slugify = require('slugify');
// strip out html to create excerpt out of the blog content to pure text
const stripHtml = require('string-strip-html');
// to update blog
const _ = require('lodash');
// helpers
const { errorHandler } = require('../helpers/dbErrorHandler');
const { smartTrim } = require('../helpers/blog');
// file system 
const fs = require('fs');


// create blog
exports.create = (req, res) => {
      // extract form data and put in form variable
      let form = new formidable.IncomingForm()
      form.keepExtensions = true // keep orig extensions if you have files in form data like jpg, png etc
      // parse form data to get data as valid js objecgt
      form.parse( req, (err, fields, files) => {
            if(err) {
                  return res.status(400).json({
                        err: 'Image could not upload'
                  })
            }

            // handle fields - if no error get all fields from form data
            const { title, body, categories, tags } = fields

            // custom validations for title, body, categories and tags
            if(!title || !title.length) {
                  return res.status(400).json({
                        error: "Title is required"
                  })
            }

            if(!body ||  body.length < 200) {
                  return res.status(400).json({
                        error: "Content too short"
                  })
            }

            if(!categories ||  categories.length === 0) {
                  return res.status(400).json({
                        error: "At least one category is required"
                  })
            }

            if(!tags ||  tags.length === 0) {
                  return res.status(400).json({
                        error: "At least one tag is required"
                  })
            }


            // create new blog - instantiate model Blog
            let blog = new Blog()
            // assign values
            blog.title = title;
            blog.body = body;
            blog.excerpt = smartTrim(body, 320, ' ', ' ...');
            blog.slug = slugify(title).toLowerCase();  // use title fields to generate a slug
            blog.mtitle = `${title} | ${process.env.APP_NAME}`; // append website name at the end of title to create meta title
            blog.mdesc = stripHtml(body.substring(0, 160)); //to generate meta desc use strip html to get excerpt from body content - 160 char is standard size
            blog.postedBy = req.user._id; //get the _id of the logged in user

            // create array of categories and tags
            let arrayOfCategories = categories && categories.split(',');
            let arrayOfTags = tags && tags.split(',');

            // handling files
            if(files.photo) {
                  // check photo size if bigger than 1mb = 10000000 bytes
                  if(files.photo.size > 10000000) {
                        // send error msg
                        return res.status(400).json({
                              error: 'Image should be less than 1mb in size'
                        })
                  }
                  // if less than 1 mb in size create blog
                  blog.photo.data = fs.readFileSync(files.photo.path); // populate values
                  blog.photo.contentType = files.photo.type 
            }

            // save in DB
            blog.save((err, result) => {
                  if(err) {
                        return res.status(400).json({
                              error: errorHandler(err)
                        });
                  }
                  // res.json(result);
                  // find blog based on blog Id in result, push the arrayOfcategories into categories field in model, return updated data 
                  Blog.findByIdAndUpdate(
                        result._id, 
                        {$push: { categories: arrayOfCategories }}, 
                        {new: true} 
                  ).exec((err, result) => {
                        if(err) { // check if there is error
                              return res.status(400).json({
                                    error: errorHandler(err)
                              })
                        } else { // if no error find blog and update with tags
                              Blog.findByIdAndUpdate(
                                    result._id,
                                    {$push: { tags: arrayOfTags }}, 
                                    {new: true} 
                              ).exec((err, result) => {
                                    //check error
                                    if(err) {
                                          return res.status(400).json({
                                                error: errorHandler(err)
                                          })
                                    } else {
                                          res.json(result)
                                    }

                              })
                        }
                  })
            })
      })
}    

// list all blog
exports.list = (req, res) => {
      // find in db
      Blog.find({})
      .populate('categories', '_id name slug') //1st args=field to be populated, 2nd=fields to get for populating
      .populate('tags', '_id name slug') 
      .populate('postedBy', '_id name username')
      .select('id title slug excerpt categories tags postedBy createdAt updatedAt') // select fields and make sure photo and body content is not selected
      .exec((err, data) => {
            if(err) {
                  return res.status(400).json({
                        error: errorHandler(err)
                  })
            }

            res.json(data); // return all the blogs
      })
}

// list All Blogs with Categories and Tags
exports.listAllBlogsCategoriesTags = (req, res) => {
      // set limit how many blog post to show - pagination
      let limit = req.body.limit ? parseInt(req.body.limit) : 10 // get limit value from front end by default 10
      let skip = req.body.skip ? parseInt(req.body.skip) : 0// how many to skip get value to front end by default 0
      
      // queries
      let blogs
      let categories
      let tags

      // find all blogs in db
      Blog.find({})
      .populate('categories', '_id name slug') 
      .populate('tags', '_id name slug') 
      .populate('postedBy', '_id name username profile')
      .sort({ createdAt: -1 }) // make sure latest blog is returned first
      .skip(skip)
      .limit(limit)
      .select('_id title slug excerpt categories tags postedBy createdAt updatedAt') 
      .exec( (err, data) => {
            if(err) {
                  return res.status(400).json({
                        error: errorHandler(err)
                  })
            }

            blogs = data // get all blogs
            // get all categories
            Category.find({}).exec( (err, c) => {
                  if(err) {
                        return res.status(400).json({
                              error: errorHandler(err)
                        })
                  }

                  categories = c // all categories
                  // get all tags
                  Tag.find({}).exec( (err, t) => {
                        if(err) {
                              return res.status(400).json({
                                    error: errorHandler(err)
                              })
                        }

                        tags = t // all tags
                        // return all blogs categories and tags
                        res.json({ blogs, categories, tags, size: blogs.length })
                   })
            })
      })

}

// get single blog
exports.read = (req, res) => {
      // extract slug from params
      const slug = req.params.slug.toLowerCase();
      // find one blog
      Blog.findOne({slug})
      // .select("-photo") //to make sure photo is not sent
      .populate('categories', '_id name slug') 
      .populate('tags', '_id name slug') 
      .populate('postedBy', '_id name username')
      .select('_id title body slug excerpt mtitle mdesc categories tags postedBy createdAt updatedAt') // select all field with body mtitle mdesc except for excerpt and photo
      .exec((err, data) => {
            if(err) {
                  return res.status(400).json({
                        error: errorHandler(err)
                  })
            }
            res.json(data); // single blog
      })
};
  
// remove blog
exports.remove = (req, res) => {
     // extract slug from params
     const slug = req.params.slug.toLowerCase();
     // find one blog and remove
     Blog.findOneAndRemove({slug})
     .exec((err, data) => {
           if(err) {
                 return res.status(400).json({
                       error: errorHandler(err)
                 })
           }
           res.json({
                 message: 'Blog deleted successfully'
           }); 
     })
};
 
// update blog
exports.update = (req, res) => {
      // extract slug from params
      const slug = req.params.slug.toLowerCase();
      
      // find blog based on slug
      Blog.findOne({slug}).exec((err, oldBlog) => {
            if(err) {
                  return res.status(400).json({
                        error: errorHandler(err)
                  })
            }
            // put data in form variable
            let form = new formidable.IncomingForm()
            form.keepExtensions = true

            // parse data
            form.parse( req, (err, fields, files) => {
                  if(err) {
                        return res.status(400).json({
                              err: 'Image could not upload'
                        })
                  }
      
                  // merge old blog to updated blog
                  let slugBeforeMerge = oldBlog.slug
                  // use lodash to update specific fields - slug will not be updated to prevent problem in google seo
                  oldBlog = _.merge(oldBlog, fields) // oldBlog=one to be updated fields = updated fields that will be coming from client side
                  // make sure slug doesn't change
                  oldBlog.slug = slugBeforeMerge

                  // destructure fields from client side
                  const { body, desc, categories, tags } = fields

                  // update excerpt desc categories and tags
                  if(body) { // if body change update excerpt
                        oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...')
                        oldBlog.desc = stripHtml(body.substring(0, 160))
                  }

                  if(categories) { 
                        oldBlog.categories = categories.split(',')
                  }

                  if(tags) { 
                        oldBlog.tags = tags.split(',')      
                  }
      
                  // handling files
                  if(files.photo) {
                        // check photo size if bigger than 1mb = 10000000 bytes
                        if(files.photo.size > 10000000) {
                              // send error msg
                              return res.status(400).json({
                                    error: 'Image should be less than 1mb in size'
                              })
                        }
                        // if less than 1 mb in size create blog
                        oldBlog.photo.data = fs.readFileSync(files.photo.path); // populate values
                        oldBlog.photo.contentType = files.photo.type 
                  }
      
                  // save updated blog in DB
                  oldBlog.save((err, result) => {
                        if(err) {
                              return res.status(400).json({
                                    error: errorHandler(err)
                              });
                        }
                        // result.photo = undefined;
                        res.json(result)
                        
                  })
            })    
      })
} 

// get blog photo
exports.photo = (req, res) => {
      // extract slug from params
      const slug = req.params.slug.toLowerCase();

      // find blog based on slug and select photo
      Blog.findOne({slug})
      .select('photo')
      .exec((err, blog) => {
            if(err || !blog) {
                  return res.status(400).json({
                        error: errorHandler(err)
                  })
            }
            // set the content type 
            res.set('Content-Type', blog.photo.contentType)
            return res.send(blog.photo.data)
      })
}

// get related blogs
exports.listRelated = (req, res) => {
      // limit param 
      let limit = req.body.limit ? parseInt(req.body.limit) : 3;
      // extract field from req body
      console.log(req.body)
      const {_id, categories} =  req.body.blog;
      

      // find in DB - not including the blog(id) but including its categories
      Blog.find( { _id: {$ne: _id}, categories: {$in: categories } } )
      .limit(limit)
      .populate('postedBy', '_id name username profile')
      .select('title slug excerpt postedBy createdAt updatedAt')
      .exec((err, blogs) => {
            if(err) {
                  return res.status(400).json({
                        error: 'Blogs not found'
                  });
            }
            res.json(blogs);
      })
}

// search blogs
exports.listSearch = (req, res) => {
      console.log(req.query); 
      // send request query
      const { search } = req.query;
      if(search) {
            // search based on title or body
            Blog.find(
            { // will work both title or body - i= not case sensitive
                  $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { body:  { $regex: search, $options: 'i' } }

                  ] 
            }, (err, blogs) => {
                  if(err) {
                        return res.status(400).json({
                              error: errorHandler(err)
                        })
                  }

                  res.json(blogs);
            }
            ).select('-photo -body'); // deselect photo and body  
      }
}

// list blogs for auth user
exports.listByUser = (req, res) => {
      User.findOne({username: req.params.username}).exec((err, user) => {
            if(err) {
                  return res.status(400).json({
                        error: errorHandler(err)
                  })
            }
            let userId = user._id
            //find blog based on userId
            Blog.find({postedBy: userId})
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug postedBy createdAt updatedAt')
            .exec((err, data) => {
                  if(err) {
                        return res.status(400).json({
                              error: errorHandler(err)
                        })
                  }
                  res.json(data)
            })
      })
}