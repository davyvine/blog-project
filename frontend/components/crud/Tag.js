import React, { useState, useEffect } from 'react';
import { getCookie } from '../../actions/auth'; // get token, cookie info
import Router from 'next/router';
import Link from 'next/link'
import { create, getTags, removeTag } from '../../actions/tag';


const Tag = ({  }) => {
   // state
   const [values, setValues] = useState({
      name: '',
      error: false,
      success: false,
      tags: [],
      removed: false,
      reload: false
   })

   // destructure state fields
   const { name, error, success, tags, removed, reload } = values
   
   // get token for creating tags
   const token = getCookie('token') // will give token in return

   // lifecycle method
   useEffect(() => {
      loadTags()
   }, [reload])

   // get all tags from backend and store in state
   const loadTags = () => {
      getTags().then(data => {
         if(data.error) {
            console.log(data.error)
         } else {
            setValues({
               ...values,
               tags: data
            })
         }
      })
   }

   // function to loop thru tags and render values
   const showTags = () => {
      return tags.map((t, i) => {
         return <button onDoubleClick={() => deleteConfirm(t.slug)} title="Double click to delete" key={i} className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</button>
      })
   }

   // confirm delete
   const deleteConfirm = slug => {
      // just like window.alert use window.confirm to ask user
      let answer = window.confirm('Are you sure you want to delete this tag?')
      // if user answer is yes, execute a function to delete category and send a request to backend
      if(answer) {
         deleteTag(slug)
      }
   }

   // delete tag function and send request to backend
   const deleteTag = slug => {
      // console.log('delete', slug)
      
      // call remove tag action to delete tag in backend db
      removeTag(slug, token).then(data => {
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
      // console.log(`${name} tag created`)

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
         return <p className="text-success">Tag is created</p>
      }
   }

   const showError = () => {
      if(error) {
         return <p className="text-danger">Tag already exist</p>
      }
   }

   const showRemoved = () => {
      if(removed) {
         return <p className="text-danger">Tag is removed</p>
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

   // form to create new tag
   const newTagForm = () => {
      return (
      <form onSubmit={clickSubmit}>
         <div className='form-group'>
            {/* Field Name */}
            <label className="text-muted">Tag</label>
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
         {newTagForm()}
         {showTags()}
      </div>
   </React.Fragment>
   )

}

export default Tag;