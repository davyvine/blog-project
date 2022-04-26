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
import { createBlog } from '../../actions/blog';
// for rich text editor - import dynamically and ssr will be false
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false})
// import quill css using node_modules can also be imported using cdn
import '../../node_modules/react-quill/dist/quill.snow.css' 
// helpers
import {QuillModules, QuillFormats} from '../../helpers/quill';


const CreateBlog = ({router}) => { //passing router as props which contains pathname, actual route, query, components etc..
   
   // grab blog in localstorage - return blog from ls if none return nothing
   const blogFromLs = () => {
      if(typeof window === 'undefined') {
         return false
      }

      if(localStorage.getItem('blog')) {
         return JSON.parse(localStorage.getItem('blog')) //convert json to js object 
      } else {
         return false
      }
   }

   // state
   const [categories, setCategories] = useState([]); // show categories and tags in checkbox
   const [tags, setTags] = useState([]);

   const [checked, setChecked] = useState([]); // use for categories
   const [checkedTag, setCheckedTag] = useState([]); // use for tags

   const [body, setBody] = useState(blogFromLs); //upon refresh state will be same as what is in localstorage  
   const [values, setValues] = useState({
      error:'', // to show error messages
      sizeError: '', // to show the size of the blog content as error
      success: '', // to show success msg when blog created successfully
      formData: '',
      title: '',
      hidePublishButton: false // when user click publish blog , hide the button
   });

   // destructure state 
   const { error, sizeError, success, formData, title, hidePublishButton } = values
   const token = getCookie('token'); // get token

   // lifecycle methods
   useEffect(() => {
      // instantiate new form data when component mounts
      setValues({
         ...values,
         formData: new FormData()
      });
      initCategories();
      initTags();
   }, [router]) // use router as option from withRouter 

   // methods to make backend request, load in useEffect
   const initCategories = () => {
      // action
      getCategories().then(data => {
         if(data.error) {
            //if error, set state
            setValues({...values, error: data.error})
         } else {
            // if no error set state for categories
            setCategories(data);
         }
      })
   }

   const initTags = () => {
      // action
      getTags().then(data => {
         if(data.error) {
            //if error, set state
            setValues({...values, error: data.error})
         } else {
            // if no error set state for tags
            setTags(data);
         }
      })
   }

   // event handlers
   const publishBlog = (e) => {
      e.preventDefault() // so browser does not reload the page
      // console.log('ready to publish blog')
      // action for creating blog to call backend api
      createBlog(formData, token) // formData=blog 1st argument
      .then(data => {
         if(data.error) { // if error state state with error msg
            setValues({...values, error: data.error})
         } else { // if no error update state with success msg and clear out state
            setValues({...values, title: '', error: '', success: `A new blog titled ${data.title} is created`})
            // clear out body which will also clear out local storage
            setBody('');
            // clear out categories and tags that was checked
            setCategories([]);
            setTags([]);
            Router.push(`/admin/crud/blog`);
         }
      })
   }

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
      // console.log(e);
      // any event push to setBody(state)
      setBody(e)
      // populate formData which will be sent to backend
      formData.set('body', e)
      // set body content to localStorage so on page refresh data will lost
      if(typeof window !== 'undefined') {
         // access localStorage and populate
         localStorage.setItem('blog', JSON.stringify(e))
      }

   }

   const handleToggle = (c) => () => {
      // clear out state if there are errors
      setValues({...values, error:''})
      // return the first index or -1
      const clickedCategory = checked.indexOf(c) // find if category id c is already in state checked
      const all = [...checked] // all categories

      if(clickedCategory === -1) { // if category c does not exist -1 then push in all categories state
         all.push(c)
      } else { // if category c exist pull 1 item out using splice
         all.splice(clickedCategory, 1)
      }

      console.log(all)
      // set state
      setChecked(all)
      // update form data
      formData.set('categories', all);
   }

   const handleTagsToggle = (t) => () => {
      // clear out state if there are errors
      setValues({...values, error:''})
      // return the first index or -1
      const clickedTag = checkedTag.indexOf(t) // find if tag id t is already in state checked
      const all = [...checkedTag] // all tags

      if(clickedTag === -1) { // if tag t does not exist -1 then push in all tags state
         all.push(t)
      } else { // if tag t exist pull 1 item out using splice
         all.splice(clickedTag, 1)
      }

      console.log(all)
      // set state
      setCheckedTag(all)
      // update form data
      formData.set('tags', all);
   }

   // method to loop through categories and tags 
   const showCategories = () => {
      return(
         // loop
         categories && categories.map((c, i) => (
            <li key={i} className="list-unstyled">
               <input onChange={handleToggle(c._id)} type="checkbox" className="mr-2" />
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
               <input onChange={handleTagsToggle(t._id)} type="checkbox" className="mr-2" />
               <label className="form-check-label">{t.name}</label>
            </li>
         ))
      )
   }

   // show error and success messages
   const showError = () => (
      <div className="alert alert-danger" style={{display: error ? '': 'none'}}>{error}</div>
   )

   const showSuccess = () => (
      <div className="alert alert-success" style={{display: success ? '': 'none'}}>{success}</div>
   )

   // create blog form
   const createBlogForm = () => {
      return (
         <form onSubmit={publishBlog}>
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
               <button type="submit" className="btn btn-primary">Publish</button>
            </div>
         </form>
      )
   }

   return (
      <div className="container-fluid pb-5">
         <div className="row">
            {/* blog form */}
            <div className="col-md-8">
               {createBlogForm()}
               <div className="pt-3">
                  {showError()}
                  {showSuccess()}
               </div>
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

export default withRouter(CreateBlog); // wrapping to get access to next router, will be able to grab that as props