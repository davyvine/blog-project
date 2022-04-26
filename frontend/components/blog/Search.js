import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// to render html
import renderHTML from 'react-render-html';
// actions
import { listSearch } from '../../actions/blog';

const Search = () => {
   // state
   const [ values, setValues ] = useState({
      search: undefined, // what the user is typing in search form
      results: [], // results from backend
      searched: false, // determine whether user submitted the form
      message: ''
   }); 

   // destructure
   const { search, results, searched, message } = values;

   // event handler
   const searchSubmit = e => {
      e.preventDefault();
      console.log(search)
      // backend call upon submit
      listSearch( {search} ).then(data => {
         // update state 
         console.log(data)
         setValues({...values, results: data, searched: true, message: `${data.length} blogs found`})
      })
   }

   const handleChange = e => {
      // update state
      setValues({ ...values, search: e.target.value, searched: false, results:[] })
   }

   const searchedBlogs = (results = []) => {
      return (
          <div className="jumbotron bg-white">
              {message && <p className="pt-4 text-muted font-italic">{message}</p>}

              {results.map((blog, i) => {
                  return (
                      <div key={i}>
                          <Link href={`/blogs/${blog.slug}`}>
                              <a className="text-primary">{blog.title}</a>
                          </Link>
                      </div>
                  );
              })}
          </div>
      );
  };

   // search form
   const searchForm = () => (
      <form onSubmit={searchSubmit}>
         <div className="row">
            {/* search input field */}
            <div className="col-md-8">
               <input type="search" className="form-control" placeholder="Search Blogs" onChange={handleChange} />
            </div>
            {/* search button */}
            <div className="col-md-4">
               <button className="btn btn-block btn-outline-primary" type="submit">Search</button>
            </div>
         </div>
      </form>
   );

   return (
      <div className="container-fluid">
         <div className="pt-3 pb-5">
            {searchForm()}
         </div>
         { searched && <div style={{marginTop: '-120px', marginBottom: '-80px'}}>{searchedBlogs(results)}</div>}
      </div>
   )
}

export default Search;