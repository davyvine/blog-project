import React from 'react';
import Navigation from '../header/Navigation'
import globalStyles from './global';


const Layout = ({ children }) => {
   return (
      <React.Fragment>
         <Navigation />
            {children}
            <style jsx global>{globalStyles}</style>
      </React.Fragment>
   )
};

export default Layout;