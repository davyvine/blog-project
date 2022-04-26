import fetch from 'isomorphic-fetch';
import {API} from '../config';
import queryString from 'query-string';
//  auth action
import {isAuth, handleResponse} from './auth';

// create new blog
export const createBlog = (blog, token) => {
   // endpoint variable
   let createBlogEndpoint;
   // check role
   if(isAuth() && isAuth().role ===1) {
      // admin user
      createBlogEndpoint = `${API}/blog` //  backend request 
   } else if (isAuth() && isAuth().role === 0) {
      createBlogEndpoint = `${API}/user/blog`
   }

   return fetch(
      `${createBlogEndpoint}`, {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Authorization': `Bearer ${token}`
      },
      body: blog // send form-data
   })
   .then(response => {
      handleResponse(response) // token expiry handler
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// list blogs with categories and tags
export const listBlogsWithCategoriesAndTags = (skip, limit) => {
   const data = {
      limit,
      skip
   }
   return fetch(
      // make request  to this url
      `${API}/blogs-categories-tags`, {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// get single blog
export const singleBlog = (slug) => {
   return fetch(
      // make request  to this url
      `${API}/blog/${slug}`, {
      method: 'GET'
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// get related blog
export const listRelated = (blog) => {
   return fetch(
      // make request  to this url
      `${API}/blogs/related`, {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(blog)
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// get list blog
export const list = (username) => {
      // endpoint variable
      let listBlogsEndpoint;
      // check role
      if(username) {
         // admin user
         listBlogsEndpoint = `${API}/${username}/blogs` //  backend request 
      } else {
         listBlogsEndpoint = `${API}/blogs`
      }

   return fetch(
      // make request  to this url
      `${listBlogsEndpoint}`, {
      method: 'GET'
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// remove blog
export const removeBlog = (slug, token) => {
      // endpoint variable
      let deleteBlogEndpoint;
      // check role
      if(isAuth() && isAuth().role ===1) {
         // admin user
         deleteBlogEndpoint = `${API}/blog/${slug}` //  backend request 
      } else if (isAuth() && isAuth().role === 0) {
         deleteBlogEndpoint = `${API}/user/blog/${slug}`
      }

   return fetch(
      // make request  to this url
      `${deleteBlogEndpoint}`, {
      method: 'DELETE',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
      }
   })
   .then(response => {
      handleResponse(response) // token expiry handler
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// update blog
export const updateBlog = (blog, token, slug) => {
      // endpoint variable
      let updateBlogEndpoint;
      // check role
      if(isAuth() && isAuth().role ===1) {
         // admin user
         updateBlogEndpoint = `${API}/blog/${slug}` //  backend request 
      } else if (isAuth() && isAuth().role === 0) {
         updateBlogEndpoint = `${API}/user/blog/${slug}`
      }

   return fetch(
      // make request  to this url
      `${updateBlogEndpoint}`, {
      method: 'PUT',
      headers: {
         'Accept': 'application/json',
         'Authorization': `Bearer ${token}`
      },
      body: blog // send form-data
   })
   .then(response => {
      handleResponse(response) // token expiry handler   
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// search blog
export const listSearch = params => {
   console.log('search params', params);
   let query = queryString.stringify(params);
   console.log('query params', query);
   return fetch(`${API}/blogs/search?${query}`, {
       method: 'GET'
   })
       .then(response => {
           return response.json();
       })
       .catch(err => console.log(err));
};