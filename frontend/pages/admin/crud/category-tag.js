import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import Category from '../../../components/crud/Category';
import Tag from '../../../components/crud/Tag';
import Link from 'next/link';

const CategoryTag = () => {
   return (
      <Layout>
         <Admin>
            <div className="container-fluid">
               {/* grid system */}
               <div className="row">
                  {/* title */}
                  <div className='col-md-12 pt-5 pb-5'>
                     <h2>Manage Categories and Tags</h2>
                  </div>
                  {/* left */}
                  <div className='col-md-6'>
                     <Category />
                     
                  </div>
                  {/* right */}
                  <div className='col-md-6'>
                     <Tag />
                  </div>
               </div>
            </div>
         </Admin>
      </Layout>
   )
}

export default CategoryTag;