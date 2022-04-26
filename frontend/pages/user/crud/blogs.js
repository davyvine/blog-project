import Layout from '../../../components/layout/Layout';
import Private from '../../../components/auth/Private';
import BlogRead from '../../../components/crud/BlogRead';
import Link from 'next/link';
// actions
import {isAuth} from '../../../actions/auth';

const Blogs = () => {
   //grab username from local storage
   const username = isAuth() && isAuth().username;
   
   return (
      <Layout>
         <Private>
            <div className="container">
               {/* grid system */}
               <div className="row">
                  {/* title */}
                  <div className='col-md-12 pt-5 pb-5'>
                     <h2>Manage blogs</h2>
                  </div>
                  <div className='col-md-12'>
                     <BlogRead username={username}/>  
                  </div>
               </div>
            </div>
         </Private>
      </Layout>
   )
}

export default Blogs;