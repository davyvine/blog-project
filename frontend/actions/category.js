// ACTIONS to call and make request to backend - API request

import fetch from 'isomorphic-fetch';
import {API} from '../config';
import {handleResponse} from './auth';

// create new category
export const create = (category, token) => {
   return fetch(
      // make request  to this url
      `${API}/category`, {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(category) //convert to json format
   })
   .then(response => {
      handleResponse(response); // token expiry handler
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// get list of category
export const getCategories = () => {
   return fetch(
      // make request  to this url
      `${API}/categories`, {
      method: 'GET'
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// get single  category
export const singleCategory = (slug) => {
   return fetch(
      // make request  to this url
      `${API}/category/${slug}`, {
      method: 'GET'
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// remove  category
export const removeCategory = (slug, token) => {
   return fetch(
      // make request  to this url
      `${API}/category/${slug}`, {
      method: 'DELETE',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
      }
   })
   .then(response => {
      handleResponse(response); // token expiry handler
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}