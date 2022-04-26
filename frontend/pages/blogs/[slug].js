import React, { useEffect, useState } from 'react';
import {withRouter} from 'next/router';
// for writing meta title meta desc etc
import Head from 'next/head';
import Link from 'next/link';
// components
import Layout from '../../components/Layout';
import SmallCard from '../../components/blog/SmallCard';
import DisqusThread from '../../components/DisqusThread';
// actions
import { singleBlog, listRelated } from '../../actions/blog';
// config
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
// to render html
import renderHTML from 'react-render-html';
// to make date and time readable
import moment from 'moment';


const SingleBlog = ({ blog, query }) => {

   // state - when component mounts show related blogs
   const [related, setRelated] = useState([]);

   const loadRelated = () => {
       listRelated({blog}).then(data => {
         if(data.error) {
            console.log(data.error)
         } else {
            setRelated(data)
         }
      })
   }

   // lifecycle   
   useEffect(() => {
      loadRelated();
   }, [])

   // head for seo
   const head = () => {
      return (
         <Head>
            <title>{blog.title} | {APP_NAME}</title>
            <meta 
               name="description" 
               content={blog.mdesc.result}
            />
            <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`}/>
            {/* for facebook - og=open graph */}
            <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} /> 
            <meta 
               property="og:description" 
               content={blog.mdesc.result}
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
            <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.slug}`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
         </Head>
      )
   }

      // show blog categories
      const showBlogCategories = blog => {
         return blog.categories.map((c,i) => (
             <Link key={i} href={`/categories/${c.slug}`}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{c.name}</a>
             </Link>
          ))
       }
    
       // show blog tags
          const showBlogTags = blog => {
             return blog.tags.map((t,i) => (
                <Link key={i} href={`/tags/${t.slug}`}>
                   <a className="btn btn-primary mr-1 ml-1 mt-3">{t.name}</a>
                </Link>
             ))
          }

      // show related blogs
      const showRelatedBlogs = () => {
         return related.map((b,i) => (
            <div className="col-md-4" ket={i}>
               <article>
                  <SmallCard blog={b}/>
               </article>
            </div>
         ))
      }

      // disqus thread function
      const showComments = () => {
         return (
            <div>
               <DisqusThread id={blog.id} title={blog.title} path={`/blog/${blog.slug}`}/>
            </div>
         )
      }

   return (
      <React.Fragment>
         {head()}
         <Layout>
            <main>
               <article>
                  <div className="container-fluid">
                     {/* display image full width */}
                     <section>
                        <div className="row"  style={{marginTop: '-30px'}}>
                           <img 
                              src={`${API}/blog/photo/${blog.slug}`}
                              alt={blog.title}
                              className="img img-fluid featured-image"
                           />
                        </div>
                     </section>

                     {/* Info about the blog */}
                     <section>
                        <div className="container">
                           <p className="lead mt-3 mark">
                              Written by  <Link href={`/profile/${blog.postedBy.username}`}><a>{blog.postedBy.username}</a></Link> | Published {moment(blog.updatedAt).fromNow()}
                           </p>
                           <h1 className="display-2 pb-3 pt-3 text-center">{blog.title}</h1>
                           {/* categories and tags */}
                           <div className="pb-3">
                              {showBlogCategories(blog)}
                              {showBlogTags(blog)}
                              <br />
                              <br />
                           </div>
                        </div>
                     </section>
                  </div>

                  {/* Blog Content */}
                  <div className="container">
                     <section>
                        <div className="col-md-12 lead">{renderHTML(blog.body)}</div>
                     </section>
                  </div>

                  {/* Show related blogs */}
                  <div className="container pb-5">
                     <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
                     <hr />
                     <div className="row">
                        {showRelatedBlogs()}
                     </div>
                  </div>

                  {/* comment/discussion section */}
                  <div className="container pb-5">
                     {showComments()}
                  </div>
               </article>
            </main>
         </Layout>
      </React.Fragment>
   )
}

SingleBlog.getInitialProps = ({query}) => { //server side query frontend side router but two are same
   return singleBlog(query.slug).then(data => {
      if(data.error) {
         console.log(data.error)
      } else {
         // console.log('GET INITIAL PROPS IN SINGLE BLOG', data)
         return { blog: data, query };
      }
   })
}

export default withRouter(SingleBlog);