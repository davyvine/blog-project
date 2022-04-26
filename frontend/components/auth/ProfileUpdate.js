import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
// actions
import { getCookie, isAuth, updateUser } from '../../actions/auth';
import { getProfile, update } from '../../actions/user';
// config
import {API} from '../../config';
 
const ProfileUpdate = () => {
   // state
   const [values, setValues] = useState({
      username: '',
      username_for_photo: '',
      name: '',
      email: '',
      about: '',
      password: '',
      error: false,
      success: false,
      loading: false,
      photo: '',
      userData: process.browser && new FormData()
   });
 
   // destructure state
   const { username, username_for_photo, name, email, about, password, error, success, loading, photo, userData } = values;
   // get token
   const token = getCookie('token');   
 
   const init = () => {
      getProfile(token).then(data => {
         if(data.error) {
            setValues({...values, error: data.error});
         } else {
            setValues({...values, username: data.username, username_for_photo: data.username, name: data.name, email: data.email, about: data.about})
         }
      })
   }
 
  // lifecycle
  useEffect(() => {
   // initialize
   init();
   setValues({...values, userData: new FormData() });
}, []);
 
   // event handler
   const handleChange = name => e => {
      const value = name === 'photo' ? e.target.files[0] : e.target.value;
      // populate formData with values
      userData.set(name, value)
      // update state
      setValues({
         ...values,
         [name]: value,
         userData,
         error: false,
         success: false
      })
   }
 
   const handleSubmit = e => {
      e.preventDefault();
      setValues({...values, loading: true}); // set loading to true
      // make request to backend
      update(token, userData).then(data => {
         if(data.error) {
            setValues({...values, error: data.error, loading: false})
         } else {
            // update local storage
            updateUser(data, () => {
               setValues({
                  ...values,
                  username: data.username, 
                  name: data.name,
                  email: data.email, 
                  about: data.about,
                  password: '',
                  success: true,
                  loading: false
               })
            })
         }
      })
   }
 
// update profile form
const profileUpdateForm = () => (
   <form onSubmit={handleSubmit}>
      <div className="form-group">
         <label className="btn btn-outline-info">
            Profile photo
            <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
         </label>
         
      </div>

      <div className="form-group">
         <label className="text-muted">Username</label>
         <input onChange={handleChange('username')} type="text" className="form-control" value={username} />
      </div>

      <div className="form-group">
         <label className="text-muted">Name</label>
         <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
      </div>

      {/* <div className="form-group">
         <label className="text-muted">Email</label>
         <input onChange={handleChange('email')} type="email" className="form-control" value={email} />
      </div> */}

      <div className="form-group">
         <label className="text-muted">About</label>
         <textarea onChange={handleChange('about')} type="text" className="form-control" value={about} />
      </div>

      <div className="form-group">
         <label className="text-muted">Password</label>
         <input onChange={handleChange('password')} type="password" className="form-control" value={password} />
      </div>

      <div>
         {showSuccess()}
         {showError()}
         {showLoading()}
      </div>

      <div>
         <button type="submit" className="btn btn-primary" disabled={!username || !name || !email}>Update</button>
      </div>
   </form>
);
 
   // show error and success msgs
   const showError = () => (
      <div className="alert alert-danger" style={{display: error ? '': 'none'}}>{error}</div>
   );

   const showSuccess = () => (
      <div className="alert alert-success" style={{display: success ? '': 'none'}}>Profile Updated</div>
   )

   const showLoading = () => (
      <div className="alert alert-info" style={{display: loading ? '': 'none'}}>Loading...</div>
   )
 
    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <img
                            src={`${API}/user/photo/${username_for_photo}`}
                            className="img img-fluid img-thumbnail mb-3"
                            style={{ maxHeight: 'auto', maxWidth: '100%'}}
                            alt="user profile"
                        />
                    </div>
                    <div className="col-md-8 mb-5">{profileUpdateForm()}</div>
                </div>
            </div>
        </React.Fragment>
    );
};
 
export default ProfileUpdate;