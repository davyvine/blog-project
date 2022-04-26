import Layout from '../../components/Layout';
import Private from '../../components/auth/Private';
import Link from 'next/link';

const UserIndex = () => {
   return (
      <Layout>
         <Private>
         <div className="container-fluid">
               {/* grid system */}
               <div className="row">
                  {/* title */}
                  <div className='col-md-12 pt-5 pb-5'>
                     <h2>User Dashboard</h2>
                  </div>
                  {/* left */}
                  <div className='col-md-4'>
                     {/* list style using bootstrap */}
                     <ul className="list-group">   

                        <li className="list-group-item">
                              <a href="/user/crud/blog">Create Blog</a>
                        </li>

                        <li className="list-group-item">
                           <Link href="/user/crud/blogs"> 
                              <a>Update/Delete Blogs</a>
                           </Link>
                        </li>

                        <li className="list-group-item">
                           <Link href="/user/update"> 
                              <a>Update Profile</a>
                           </Link>
                        </li>

                     </ul>
                  </div>
                  {/* right */}
                  <div className='col-md-8'>
                     right
                  </div>
               </div>
            </div>
         </Private>
      </Layout>
   )
}

export default UserIndex;