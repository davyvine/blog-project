import React, { useState, useEffect } from 'react';
import { isAuth } from '../../actions/auth';
import Router from 'next/router';

const Admin = ({ children }) => {
   // lifecycle method
   useEffect( () => {
      if( !isAuth() ) {
         Router.push(`/signin`)
      } else if (isAuth().role !== 1) {
         Router.push(`/`)
      }
   }, [] )
   return <React.Fragment>{children}</React.Fragment>
}

export default Admin;