import React, { Fragment } from 'react';
import Layout from '../layout/Layout';
import About from './About/About';
import Features from './Features/Features'
import Highlights from './Highlights/Highlights';
import Book from './Book/Book';
import '../../static/sass/main.scss'

const main = (props) => {
   return (
      <Fragment>
            <About />
            <Features />
            <Highlights />
      </Fragment>
    
   )
}

export default main;