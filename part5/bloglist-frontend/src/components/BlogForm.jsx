import { useState } from "react"

const BlogForm = ({addBlog, handleNottification}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = async (event) => {
    event.preventDefault();
   
    if (title === '' || author === '' || url === '') {
      handleNottification('Please provide all information', true)
      return;
    }

    const success = await addBlog({title, author, url});
    if (success) {
      setTitle("")
      setAuthor("")
      setUrl("")
    }
  } 
 
  return (
    <form onSubmit={handleCreateBlog}>
      <div>
        <label>
          title:
          <input type='text' value={title} onInput={({target}) => setTitle(target.value)} />
        </label>
      </div>
      <div>
        <label>
          author:
          <input type='text' value={author} onInput={({target}) => setAuthor(target.value)} />
        </label>
      </div>
      <div>
        <label>
          url:
          <input type='text' value={url} onInput={({target}) => setUrl(target.value)} />
        </label>
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default BlogForm