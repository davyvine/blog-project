import Link from 'next/link';
// to render html
import renderHTML from 'react-render-html';
// to make date and time readable
import moment from 'moment';
// config
import {API} from '../../config';


const SmallCard = ({blog}) => {
   return (
      <div className="card">

         {/* card header */}
         <section>
            <Link href={`/blogs/${blog.slug}`}>
               <a>
                  <img 
                     className="img img-fluid" 
                     style={{maxHeight: '200px', width: '100%'}} 
                     src={`${API}/blog/photo/${blog.slug}`}
                     alt={blog.title}
                  />
               </a>
            </Link>
         </section>

         {/* card body content */}
         <div className="card-body">
            <section>
               <Link href={`/blogs/${blog.slug}`}>
                 <a><h5 className="card-title">{blog.title}</h5></a>
               </Link>
               <p className="card-text">{renderHTML(blog.excerpt)}</p>
            </section>
         </div>

         {/* created by info */}
         <div className="card-body">
               <div>
                  Posted {moment(blog.updatedAt).fromNow()} by{' '}
                  <Link href={`/profile/${blog.postedBy.username}`}><a className="float-right">{blog.postedBy.username}</a></Link> 
               </div>
         </div>  
      </div>
   )
}

export default SmallCard;