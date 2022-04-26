import React, { useState, useEffect } from 'react';
import { signin, authenticate, isAuth } from '../../actions/auth';
import Router from 'next/router';

const SigninComponent = () => {
   // state
   const [values, setValues] = useState({
      email: 'anna@gmail.com',
      password: '123456',
      error: '',
      loading: false,
      message: '',
      showForm: true
   })

   // destructure values from state
   const { email, password, error, loading, message, showForm } = values // instead of using values.name ...

   // lifecycle method using useEffect
   useEffect( () => {
      isAuth() && Router.push(`/`)
   }, [] );

   // methods for handling events
   const handleSubmit = (e) => {
      e.preventDefault()
      // console.table({ name, email, password, error, loading, message, showForm }); //test to show state once form is submitted in table format instead of simple console.log
      setValues({ ...values, loading: true, error: false })
      // create new user object by getting the values of fields in the state
      const user = { email, password }
      // pass user data to signup action
      signin(user)
      // then check response data if theres an error else empty out state values
      .then(data => {
         if(data.error) {
            setValues({ ...values, error: data.error, loading: false })
         } else {
            // redirect to hompepage after success signin
            // save user token to cookie

            // save user info to local storage

            //authenticate user
            authenticate(data, () => {
               // redirect to admin or user page
               if(isAuth() && isAuth().role  === 1) {
                  Router.push(`/admin`);
               } else {
                  Router.push(`/user`);
               }
            })
            
         }
      })
   }

   // show loading method
   const showLoading = () => (loading ? <div className="alert alert-info">Loading...</div> : '');
   // show error method
   const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
   // show message method
   const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');

   // function returning another function
   const handleChange = name => (e) => {
      setValues({
          ...values, 
          error: false, 
          [name]: e.target.value //[name] - dynamic paramater can be name, email, password passed in handleChange()
         })
   }

   // form
   const signinForm = () => {
      return (
         <form onSubmit={handleSubmit}>

            <div className="form-group">
               <input 
                  value={email} 
                  onChange={handleChange('email')} 
                  type="email" 
                  className="form-control" 
                  placeholder="Type your email" />
            </div>

            <div className="form-group">
               <input 
                  value={password} 
                  onChange={handleChange('password')} 
                  type="password" 
                  className="form-control" 
                  placeholder="Type your password" />
            </div>

            <div>
               <button className="btn btn-primary">Signin</button>
            </div>

         </form>
      )
   }


   return (
      <React.Fragment>
         { showError() }
         { showLoading() }
         { showMessage() }
         { showForm && signinForm() }
      </React.Fragment>
   )
}

export default SigninComponent;
