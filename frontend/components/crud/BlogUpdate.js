import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link'
// for using react quill which only runs to client side only
import dynamic from 'next/dynamic';
// export component to get access to props
import {withRouter} from 'next/router';
// actions
import { getCookie, isAuth } from '../../actions/auth'; // get token, cookie info
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { singleBlog, updateBlog } from '../../actions/blog';
// for rich text editor - import dynamically and ssr will be false
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false})
// import quill css using node_modules can also be imported using cdn
import '../../node_modules/react-quill/dist/quill.snow.css' 
// helpers
import {QuillModules, QuillFormats} from '../../helpers/quill';
//config
import {API} from '../../config';

const BlogUpdate = ({ router }) => {
   // state
   const [body, setBody] = useState(''); // for getting data from react quill text editor

   const [categories, setCategories] = useState([]); // show categories and tags in checkbox
   const [tags, setTags] = useState([]);

   const [checked, setChecked] = useState([]); // use for categories
   const [checkedTag, setCheckedTag] = useState([]); // use for tags

   const [values, setValues] = useState({ // for getting values from the blog
      error:'', // to show error messages
      success: '', // to show success msg when blog created successfully
      formData: '', // blog 
      title: '', // blog title
      body: '' // blog content
   });

   // destructure state
   const { error, success, formData, title } = values
   // get token
   const token = getCookie('token');

   // lifecycle when component mount - make request to backend to get the blog info
   useEffect(() => {
      setValues({...values, formData: new FormData()}) // upon mount create new form
      initBlog(); 
      initCategories();
      initTags();
   }, [router]); //pass router so anytime router changes or refresh

   // methods
   const initBlog = () => {
      // check router if there is slug - will only get blog when component mounts
      if(router.query.slug) {
         // make request to backend
         singleBlog(router.query.slug).then(data => {
            if(data.error) {
               console.log(data.error)
            } else {
               setValues({...values, title: data.title}) // get title to populate form
               setBody(data.body); // get blog body to populate form
               setCategoriesArray(data.categories); // get category data to populate state
               setTagsArray(data.tags); // get tags data to populate state
            }
         })
      }
   }

    const setCategoriesArray = blogCategories => {
      let ca = [] // categories array
      blogCategories.map((c,i) => {
         //push categories into array
         ca.push(c._id)
      })
      // update checked categories in state
      setChecked(ca);
    };

    const setTagsArray = blogTags => {
        let ta = [];
        blogTags.map((t, i) => {
            ta.push(t._id);
        });
        setCheckedTag(ta);
    };

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setCategories(data);
            }
        });
    };

    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setTags(data);
            }
        });
    };

    const handleToggle = c => () => {
        setValues({ ...values, error: '' });
        // return the first index or -1
        const clickedCategory = checked.indexOf(c);
        const all = [...checked];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }
        console.log(all);
        setChecked(all);
        formData.set('categories', all);
    };

    const handleTagsToggle = t => () => {
        setValues({ ...values, error: '' });
        // return the first index or -1
        const clickedTag = checkedTag.indexOf(t);
        const all = [...checkedTag];

        if (clickedTag === -1) {
            all.push(t);
        } else {
            all.splice(clickedTag, 1);
        }
        console.log(all);
        setCheckedTag(all);
        formData.set('tags', all);
    };

    const findOutCategory = c => {
        const result = checked.indexOf(c);
        if (result !== -1) {
            return true;
        } else {
            return false;
        }
    };

    const findOutTag = t => {
        const result = checkedTag.indexOf(t);
        if (result !== -1) {
            return true;
        } else {
            return false;
        }
    };

   // method to loop through categories and tags 
   const showCategories = () => {
      return(
         // loop
         categories && categories.map((c, i) => (
            <li key={i} className="list-unstyled">
               <input onChange={handleToggle(c._id)} checked={findOutCategory(c._id)} type="checkbox" className="mr-2" />
               <label className="form-check-label">{c.name}</label>
            </li>
         ))
      )
   }

   const showTags = () => {
      return(
         // loop
         tags && tags.map((t, i) => (
            <li key={i} className="list-unstyled">
               <input onChange={handleTagsToggle(t._id)} checked={findOutTag(t._id)} type="checkbox" className="mr-2" />
               <label className="form-check-label">{t.name}</label>
            </li>
         ))
      )
   }

   // event handlers
   const handleChange = (name) => (e) => { //name can be title, photo, etc
      // console.log(e.target.value)
      // check name passed if its photo or text
      const value = name === 'photo' ? e.target.files[0] : e.target.value
      // populate formData with values
      formData.set(name, value)
      // update state
      setValues({
         ...values,
         [name]: value,
         formData,
         error: ''
      })
   }

   const handleBody = (e) => {
      setBody(e); //update body by getting values from event
      formData.set('body', e) // add event in the form data state
   };

   const editBlog = (e) => {
      e.preventDefault();
      // pass updated blog from formData
      updateBlog(formData, token, router.query.slug).then(data => {
         if(data.error) {
            setValues({...values, error: data.error}) // add error state
         } else { // reset state 
            setValues({...values, title: '', success:`Blog titled "${data.title}" is successfully created`})
            // redirect based on role
            if(isAuth() && isAuth().role === 1 ) {
               // Router.replace(`/admin/crud/${router.query.slug}`)
               Router.replace(`/admin`);
               Router.replace(`/blogs`);
            } else if (isAuth() && isAuth().role === 0 ) {
               // Router.replace(`/user/crud/${router.query.slug}`)
               Router.replace(`/user`);
               Router.replace(`/blogs`);
            }
         }
      })
   };

   // show error and success messages
   const showError = () => (
      <div className="alert alert-danger" style={{display: error ? '': 'none'}}>{error}</div>
   )

   const showSuccess = () => (
      <div className="alert alert-success" style={{display: success ? '': 'none'}}>{success}</div>
   )


   // blog form for editing
   const updateBlogForm = () => {
      return (
         <form onSubmit={editBlog}>
            <div className="form-group">
               <label className="text-muted">Title</label>
               <input 
                  type="text" 
                  className="form-control" 
                  onChange={handleChange('title')}
                  value={title}
               />
            </div>

            <div className="form-group">
               <ReactQuill 
                  value={body} 
                  placeholder="Write something amazing..."
                  onChange={handleBody}
                  modules={QuillModules}
                  formats={QuillFormats}
               />
            </div>

            <div>
               <button type="submit" className="btn btn-primary">Update</button>
            </div>
         </form>
      )
   }


   return (
      <div className="container-fluid pb-5">
         <div className="row">
            {/* blog form */}
            <div className="col-md-8">
                  {updateBlogForm()}
               <div className="pt-3">
                  {showSuccess()}
                  {showError()}
               </div>

               { body && (
                  <img 
                     src={`${API}/blog/photo/${router.query.slug}`} 
                     alt={title}
                     style={{width: '100%'}}
                  />
               )}
            </div>
            {/* sidebar */}
            <div className="col-md-4">
               {/* image upload */}
               <div className="form-group pb-2">
                  <h5>Featured image</h5>
                  <hr />

                  <small className="text-muted">Max size: 1mb </small>
                  <br />

                  <label className="btn btn-outline-info">
                     Upload featured image
                     <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                  </label>
               </div>
               <div>
                  <h5>Categories</h5>
                  <hr />
                  <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>{showCategories()}</ul>
               </div>
               <div>
                  <h5>Tags</h5>
                  <hr />
                  <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>{showTags()}</ul>
               </div>
            </div>
         </div>
      </div>
   )
}

export default withRouter(BlogUpdate); 