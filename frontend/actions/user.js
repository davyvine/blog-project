import fetch from 'isomorphic-fetch';
import {API} from '../config';
import {handleResponse} from './auth';


// public profile request
export const userPublicProfile = (username) => {
   return fetch(
      // make request  to this url
      `${API}/user/${username}`, {
      method: 'GET',
      headers: {
         Accept: 'application/json'
      }
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// get profile request
export const getProfile = token => {
   return fetch(
      // make request  to this url
      `${API}/user/profile`, {
      method: 'GET',
      headers: {
         Accept: 'application/json',
         Authorization: `Bearer ${token}`
      }
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// update profile request
export const update = (token, user) => {
   return fetch(`${API}/user/update`, {
       method: 'PUT',
       headers: {
           Accept: 'application/json',
           Authorization: `Bearer ${token}`
       },
       body: user
   })
       .then(response => {
            handleResponse(response); // token expiry handler
           return response.json();
       })
       .catch(err => console.log(err));
};