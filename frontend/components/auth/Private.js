import React, { useState, useEffect } from 'react';
import { isAuth } from '../../actions/auth';
import Router from 'next/router';

const Private = ({ children }) => {
   // lifecycle method
   useEffect( () => {
      if( !isAuth() ) {
         Router.push(`/signin`)
      }
   }, [] )
   return <React.Fragment>{children}</React.Fragment>
}

export default Private;