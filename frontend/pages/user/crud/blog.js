import Layout from '../../../components/layout/Layout';
import Private from '../../../components/auth/Private';
import BlogCreate from '../../../components/crud/BlogCreate';
import Link from 'next/link';

const Blog = () => {
   return (
      <Layout>
         <Private>
            <div className="container-fluid">
               {/* grid system */}
               <div className="row">
                  {/* title */}
                  <div className='col-md-12 pt-5 pb-5'>
                     <h2>Create new blog</h2>
                  </div>
                  <div className='col-md-12'>
                     <BlogCreate />  
                  </div>
               </div>
            </div>
         </Private>
      </Layout>
   )
}

export default Blog;