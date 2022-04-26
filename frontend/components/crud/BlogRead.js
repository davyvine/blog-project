import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link'
// actions
import { getCookie, isAuth } from '../../actions/auth'; // get token, cookie info
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { list, removeBlog } from '../../actions/blog';
import moment from 'moment';

const BlogRead = ({username}) => {

   // state
   const [blogs, setBlogs] = useState([]);
   const [message, setMessage] = useState('');

   // get cookie
   const token = getCookie('token');

   // lifecycle to load all the blogs
   useEffect(() => {
      loadBlogs();
   }, [])

   const loadBlogs = () => {
      list(username).then(data => {
         if(data.error) {
            console.log(data.error);
         } else {
            setBlogs(data);
         }
      })
   }

   // methods - to send req to backend
      const deleteBlog = (slug) => {
         removeBlog(slug, token).then(data => {
            if(data.error) {
               console.log(data.error)
            } else {
               setMessage(data.message); // update state
               loadBlogs(); // after deletion reload blogs
            }
         })
      }
   
      const showUpdateButton = (blog) => {
         if(isAuth() && isAuth().role ===0) {
            return (
                  <a href={`/user/crud/${blog.slug}`} className="ml-2 btn btn-sm btn-warning">Update</a>
            )
         } else if (isAuth() && isAuth().role === 1){
            return (
                  <a href={`/admin/crud/${blog.slug}`} className="ml-2 btn btn-sm btn-warning">Update</a>
            )
         }
      }

   // event handlers
   const deleteConfirm = (slug) => {
      let answer = window.confirm('Are you sure you want to delete your blog?')
      if(answer) {
         deleteBlog(slug)
      }
   }

   // loop through all blogs
   const showAllBlogs = () => {
      return blogs.map((b,i) => {
         return(
            <div key={i} className="pb-5">
               <h3>{b.title}</h3>
               <p className="mark">Written by {b.postedBy.name} | Published on {moment(b.updatedAt).fromNow()}</p>
               <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(b.slug)}>Delete</button>
               {showUpdateButton(b)}
            </div>
         )
      })
   }



   return (
      <React.Fragment>
            <div className="row">
               <div className="col-md-12">
                  {message && <div className="alert alert-warning">{message}</div>}
                  {showAllBlogs()}
               </div>
            </div>
      </React.Fragment>
   )
}

export default BlogRead;
