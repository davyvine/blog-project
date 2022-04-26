// ACTIONS to call and make request to backend - API request

import fetch from 'isomorphic-fetch';
import {API} from '../config';
import {handleResponse} from './auth';

// create new tag
export const create = (tag, token) => {
   return fetch(
      // make request  to this url
      `${API}/tag`, {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tag) //convert to json format
   })
   .then(response => {
      handleResponse(response); // token expiry handler
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// get list of tag
export const getTags = () => {
   return fetch(
      // make request  to this url
      `${API}/tags`, {
      method: 'GET'
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// get single  tag
export const singleTag = (slug) => {
   return fetch(
      // make request  to this url
      `${API}/tag/${slug}`, {
      method: 'GET'
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// remove  tag
export const removeTag = (slug, token) => {
   return fetch(
      // make request  to this url
      `${API}/tag/${slug}`, {
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