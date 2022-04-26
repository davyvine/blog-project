// React quill rich text editor modules for toolbar
export const QuillModules = {
   toolbar: [
       [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
       [{ size: [] }],
       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
       [{ list: 'ordered' }, { list: 'bullet' }],
       ['link', 'image', 'video'],
       ['clean'],
       ['code-block']
   ]
};

// for the text editor
export const QuillFormats = [
   'header',
   'font',
   'size',
   'bold',
   'italic',
   'underline',
   'strike',
   'blockquote',
   'list',
   'bullet',
   'link',
   'image',
   'video',
   'code-block'
];