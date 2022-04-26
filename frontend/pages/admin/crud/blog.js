import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import BlogCreate from '../../../components/crud/BlogCreate';
import Link from 'next/link';

const Blog = () => {
   return (
      <Layout>
         <Admin>
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
         </Admin>
      </Layout>
   )
}

export default Blog;