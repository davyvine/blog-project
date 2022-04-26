import React, { useState } from 'react';
import {withRouter} from 'next/router';
// for writing meta title meta desc etc
import Head from 'next/head';
import Link from 'next/link';
// components
import Layout from '../../components/Layout';
import Card from '../../components/blog/Card';
// actions
import {listBlogsWithCategoriesAndTags} from '../../actions/blog';
// config
import {API, DOMAIN, APP_NAME, FB_APP_ID} from '../../config';

const Blogs = ({ blogs, categories, tags, totalBlogs, blogsLimit, blogSkip, router }) => {
   // state
   const [limit, setLimit] =useState(blogsLimit);
   const [skip, setSkip] =useState(0);
   const [size, setSize] =useState(totalBlogs);
   const [loadedBlogs, setLoadedBlogs] =useState([]);

   // Unique head - for seo robots
   const head = () => {
      return (
         <Head>
            <title>Programming Blogs | {APP_NAME}</title>
            <meta 
               name="description" 
               content="Programming blogs and tutorials on react node next vue ph laravel and web developmetn"
            />
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`}/>
            {/* for facebook - og=open graph */}
            <meta property="og:title" content={`Latest web development tutorials | ${APP_NAME}`} /> 
            <meta 
               property="og:description" 
               content="Programming blogs and tutorials on react node next vue ph laravel and web developmetn"
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
         </Head>
      )
   }

   // load more functionality
   const loadMore = () => {
      let toSkip = skip + limit
      // make request to backend api
      listBlogsWithCategoriesAndTags(toSkip, limit).then(data => {
         if(data.error) {
            console.log(error)
         } else {
            setLoadedBlogs([...loadedBlogs, ...data.blogs])
            //populate size and skip
            setSize(data.size);
            setSkip(toSkip);
         }
      })
   }

   const loadMoreButton = () => {
      return(
         size > 0 
         && size >= limit 
         && ( <button 
               className="btn btn-outline-primary btn-lg"
               onClick={loadMore} >
                  Load More
             </button>)
      )
   }
   
   // loop through all blogs - to show all blogs
   const showAllBlogs = () => {
      return blogs.map((blog, i) => {
         return ( 
         <article key={i}>
            <Card blog={blog} />
            <hr />
         </article>
         )
      })    
   }

   // show all categories and tags - loop through
   const showAllCategories = () => {
      return categories.map((c, i) => {
         return <Link href={`/categories/${c.slug}`} key={i}>
            <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
         </Link>
      })
   }

   const showAllTags = () => {
      return tags.map((t, i) => {
         return <Link href={`/tags/${t.slug}`} key={i}>
            <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
         </Link>
      })
   }

   // show loaded blogs 
   const showLoadedBlogs = () => {
      return loadedBlogs.map((b, i) => (
         <article ket={i}>
            <Card blog={b} />
         </article>
      ))
   }

   return (
      <React.Fragment>
         {head()}

         <Layout>
            <main>
               <div className="container-fluid">
                  <header>
                     {/* title */}
                     <div className="col-md-12 pt-3">
                        <h1 className="display-4 font-weight-bold text-center">Programming blogs and tutorials</h1>
                     </div>
                     {/* list of all categories and tags */}
                     <section>
                        <div className="pb-5 text-center">
                           {showAllCategories()}
                           <br />
                           {showAllTags()}
                        </div>
                     </section>
                  </header>
               </div>

               <div className="container-fluid">{showAllBlogs()}</div>
               <div className="container-fluid">{showLoadedBlogs()}</div>
               <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
            </main>
         </Layout>
      </React.Fragment>
   )
}

// lifecycle method for SSR
Blogs.getInitialProps = () => {
   // pagination default values upon page load
   let skip = 0;
   let limit = 2;
   // make request to backend
   return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
      if(data.error) {
         console.log(data.error)
      } else {
         return { // return is important - once all fields are return it will be available as props to Blogs function
            blogs: data.blogs,
            categories: data.categories,
            tags: data.tags,
            totalBlogs: data.size,
            blogsLimit: limit,
            blogSkip: skip
         } 
      }
   })
}

export default withRouter(Blogs);