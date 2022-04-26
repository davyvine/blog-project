import React, { useEffect, useState } from 'react';
import {withRouter} from 'next/router';
// for writing meta title meta desc etc
import Head from 'next/head';
import Link from 'next/link';
// components
import Layout from '../../components/Layout';
import Card from '../../components/blog/Card';
// actions
import { userPublicProfile } from '../../actions/user';
// config
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
// to render html
import renderHTML from 'react-render-html';
// to make date and time readable
import moment from 'moment';

const UserProfile = ({ user, blogs, query}) => {

   // head for seo
   const head = () => {
      return (
         <Head>
            <title>{user.username} | {APP_NAME}</title>
            <meta 
               name="description" 
               content={`Blogs by ${user.name}`}
            />
            <link rel="canonical" href={`${DOMAIN}/profile/${query.username}`}/>
            {/* for facebook - og=open graph */}
            <meta property="og:title" content={`${user.username} | ${APP_NAME}`} /> 
            <meta 
               property="og:description" 
               content={`Blogs by ${user.name}`}
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}/profile/${query.username}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
         </Head>
      )
   }

   // loop through user blogs
   const showUserBlogs = () => {
      return blogs.map((b,i) => {
         return (
            <div className="mt-4 mb-4" key={i}>
               <Link href={`/blogs/${b.slug}`}>
                  <a className="lead">{b.title}</a>
               </Link>
            </div>
         )
      })
   }

   return (
      <React.Fragment>
         {head()}
         <Layout>
            <div className="container">
               <div className="row">
                  <div className="col-md-12">
                     <div className="card">
                        <div className="card-body">
                           <div className="row">
                              <div className="col-md-8">
                                 <h5>{user.name}</h5>
                                 <p className="text-muted">Joined {moment(user.createdAt).fromNow()}</p>
                              </div>
                              <div className="col-md-4">
                                 <img
                                    src={`${API}/user/photo/${user.username}`}
                                    className="img img-fluid img-thumbnail mb-3"
                                    style={{ maxHeight: '100px', maxWidth: '100%'}}
                                    alt="user profile"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <br />

            {/* blogs of user */}
            <div className="container pb-5">
                  <div className="row">
                     <div className="col-md-6">
                        {/* recent posts */}
                        <div className="card">
                           <div className="card-body">
                              <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-light">Recent blogs by {user.name}</h5>
                              {showUserBlogs()}
                           </div>
                        </div>
                     </div>

                     <div className="col-md-6">
                        <div className="card">
                           <div className="card-body">
                              <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-light">Message {user.name}</h5>
                              <br />
                              <p>Contact Form</p>
                           </div>
                        </div>
                     </div>
                  </div>
            </div>
         </Layout>
      </React.Fragment>
   )
}

// server side rendering
UserProfile.getInitialProps = ({query}) => { //server side query frontend side router but two are same
   return userPublicProfile(query.username).then(data => {
      if(data.error) {
         console.log(data.error)
      } else {
         // console.log('GET INITIAL PROPS IN SINGLE BLOG', data)
         return { user: data.user, blogs: data.blogs, query };
      }
   })
}

export default UserProfile;