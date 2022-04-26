// ACTIONS to call and make request to backend - API request
// all auth related methods will be written here

import fetch from 'isomorphic-fetch';
import {API} from '../config';
import cookie, { remove } from 'js-cookie';
import Router from 'next/router';

// token expiry
export const handleResponse = response => {
   // check response status if token expires
   if(response.status === 401) {
      signout(() => { // execute signout method to clear cookies and ls
         // redirect user
         Router.push({
            pathname: '/signin', //signin page
            query: {
               message: 'Your session is expired. Please signin'
            }
         })
      })
   } else {
      return;
   }
}


// signup
export const signup = (user) => {
   return fetch(
      // backend url to call
      `${API}/signup`, {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(user) //convert to json format
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// signin
export const signin = (user) => {
   return fetch(
      // backend url to call
      `${API}/signin`, {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(user) //convert to json format
   })
   .then(response => {
      return response.json() // response from backend
   })
   .catch(err => {
      console.log(err)
   })
}

// signout
export const signout = (next) => {
   // remove all info in client servers
   removeCookie('token')
   removeLocalStorage('user')
   next ();

   // make request to backend
   return fetch(`${API}/signout`, {
      method: 'GET',
   })
      .then(response => {
         console.log('signout success')
      })
      .catch(err => console.log(err));
}

// set cookie
export const setCookie = (key, value) => {
   // check if we are running in client side
   if(process.browser) {
      cookie.set(key, value, {
         expires: 1
      });
   }
};

// remove cookie
export const removeCookie = (key) => {
   // check if we are running in client side
   if(process.browser) {
      cookie.remove(key, {
         expires: 1
      });
   }
};

// get cookie
export const getCookie = (key) => {
   // check if we are running in client side
   if(process.browser) {
      return cookie.get(key);
   }
};

// set localstorage
export const setLocalStorage = (key, value) => {
   if(process.browser) {
      localStorage.setItem(key, JSON.stringify(value))
   }
}

// remove localstorage
export const removeLocalStorage = (key) => {
   if(process.browser) {
      localStorage.removeItem(key);
   }
}

// autheticate user by passing data to cookie and localstorage
// will be used in signinComponent
export const authenticate = (data, next) => {
   setCookie('token', data.token);
   setLocalStorage('user', data.user) //(user = key, data.user = value)
   next (); // middleware, returns callback function. Do or execute other things in next()
}

// Will always give back authenticated user saved in localStorage, can easily check logged in users name, email etc...
export const isAuth = () => {
   if(process.browser) {
      // check if there is a cookie
      const cookieChecked = getCookie('token') //get cookie by the name or key token. will be populated when there is a logged in user otherwise empty
      if(cookieChecked) { 
         // if cookie existed check localstorage
         if(localStorage.getItem('user')) {
            return JSON.parse(localStorage.getItem('user'))
         } else {
            return false;
         }
      }
   }
}

// update user - update local storage then clear state
export const updateUser = (user, next) => {
   if(process.browser) {
      if(localStorage.getItem('user')) { 
         let auth = JSON.parse(localStorage.getItem('user')); // old user info
         auth = user // save new user info 
         localStorage.setItem('user', JSON.stringify(auth)) // set local storage to updated
         next(); // execute next callback
      }
   }
}