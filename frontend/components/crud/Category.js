import React, { useState, useEffect } from 'react';
import { getCookie } from '../../actions/auth'; // get token, cookie info
import Router from 'next/router';
import Link from 'next/link'
import { create, getCategories, removeCategory } from '../../actions/category';


const Category = ({  }) => {
   // state
   const [values, setValues] = useState({
      name: '',
      error: false,
      success: false,
      categories: [],
      removed: false,
      reload: false
   })

   // destructure state fields
   const { name, error, success, categories, removed, reload } = values
   
   // get token for creating categories
   const token = getCookie('token') // will give token in return

   // lifecycle method
   useEffect(() => {
      loadCategories()
   }, [reload])

   // get all categories from backend and store in state
   const loadCategories = () => {
      getCategories().then(data => {
         if(data.error) {
            console.log(data.error)
         } else {
            setValues({
               ...values,
               categories: data
            })
         }
      })
   }

   // function to loop thru categories and render values
   const showCategories = () => {
      return categories.map((c, i) => {
         return <button onDoubleClick={() => deleteConfirm(c.slug)} title="Double click to delete" key={i} className="btn btn-outline-primary mr-1 ml-1 mt-3">{c.name}</button>
      })
   }

   // confirm delete
   const deleteConfirm = slug => {
      // just like window.alert use window.confirm to ask user
      let answer = window.confirm('Are you sure you want to delete this category?')
      // if user answer is yes, execute a function to delete category and send a request to backend
      if(answer) {
         deleteCategory(slug)
      }
   }

   // delete category function and send request to backend
   const deleteCategory = slug => {
      // console.log('delete', slug)
      
      // call removeCategory action to delete category in backend db
      removeCategory(slug, token).then(data => {
         if(data.error) {
            console.log(data.error)
         } else {
            setValues({
               ...values,
               error: false,
               success: false,
               name: '',
               removed: !removed,
               reload: !reload
            })
         }
      })
   } 



   // event handlers
   const clickSubmit = (e) => {
      e.preventDefault()
      // console.log(`${name} category created`)

      // call action for backend request
      create({name}, token).then(data => {
         // if error set state error
         if(data.error) {
            setValues({
               ...values,
               error: data.error,
               success: false
            }) 
         } else { // if no error set state success
            setValues({
               ...values,
               error: false,
               success: true,
               name: '',
               removed: removed,
               reload: !reload
            })
         }
      })
   }

   const handleChange = (e) => {
      setValues({
         ...values,
         name: e.target.value,
         error: false,
         success: false,
         removed: ''
      })
   }

   // methods to show messages when success , error, removed
   const showSuccess = () => {
      if(success) {
         return <p className="text-success">Category is created</p>
      }
   }

   const showError = () => {
      if(error) {
         return <p className="text-danger">Category already exist</p>
      }
   }

   const showRemoved = () => {
      if(removed) {
         return <p className="text-danger">Category is removed</p>
      }
   }

   const mouseMoveHandler = e => {
      return setValues({
         ...values,
         error: false,
         success: false,
         removed: ''
      })
   }

   // form to create new category
   const newCategoryForm = () => {
      return (
      <form onSubmit={clickSubmit}>
         <div className='form-group'>
            {/* Field Name */}
            <label className="text-muted">Category</label>
            {/* Input box */}
            <input 
               type="text" 
               className="form-control" 
               onChange={handleChange} 
               value={name} 
               required
            />
         </div>
         <div>
            {/* Submit Button */}
            <button type="submit" className="btn btn-primary">Create</button>
         </div>
      </form>
      )
   }

   return (
   <React.Fragment>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
         {newCategoryForm()}
         {showCategories()}
      </div>
   </React.Fragment>
   )

}

export default Category;