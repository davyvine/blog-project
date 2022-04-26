import React, { useEffect, useState } from 'react';
import {withRouter} from 'next/router';
// for writing meta title meta desc etc
import Head from 'next/head';
import Link from 'next/link';
// components
import Layout from '../../components/Layout';
import Card from '../../components/blog/Card';
// actions
import { singleCategory } from '../../actions/category';
// config
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
// to render html
import renderHTML from 'react-render-html';
// to make date and time readable
import moment from 'moment';


// server side page
const Category = ({ category, blogs, query }) => {
      // head for seo
      const head = () => {
         return (
            <Head>
               <title>{category.name} | {APP_NAME}</title>
               <meta 
                  name="description" 
                  content={`Best programming tutorial based on ${category.name}`}
               />
               <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`}/>
               {/* for facebook - og=open graph */}
               <meta property="og:title" content={`${category.name} | ${APP_NAME}`} /> 
               <meta 
                  property="og:description" 
                  content={`Best programming tutorial based on ${category.name}`}
               />
               <meta property="og:type" content="website" />
               <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`} />
               <meta property="og:site_name" content={`${APP_NAME}`} />
   
               <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.jpg`} />
               <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.jpg`} />
               <meta property="og:image:type" content="image/jpg" />
               <meta property="fb:app_id" content={`${FB_APP_ID}`} />
            </Head>
         )
      }

   return (
      <React.Fragment>
         {head()}
         <Layout>
            <main>
               <div className="container-fluid ">
                  <header>
                     <div className="col-md-12 pt-3">
                        <h1 className="display-4 font-weight-bold text-center">{category.name}</h1>
                        {/* loop through the blogs */}
                        {blogs.map((b,i) => (
                           <div>
                              <Card key={i} blog={b} />
                              <hr />
                           </div>
                           ))}
                     </div>
                  </header>
               </div>
            </main>
         </Layout>
      </React.Fragment>
   )
}

Category.getInitialProps = ({query}) => {
   return singleCategory(query.slug).then(data => {
      if(data.error) {
         console.log(data.error);
      } else {
         return { category: data.category, blogs: data.blogs, query };
      }
   })
}

export default Category;