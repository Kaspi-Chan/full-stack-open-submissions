import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [expanded, setExpanded] = useState(false)

  return (
    <div style={blogStyle} className='blog'>
      <div className='blog-content'>
        <span>{blog.title} </span>
        <span>{blog.author} </span>
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? 'hide' : 'view'}
        </button>
      </div>
      <div className='blog-secondary-content' style={{ display: expanded ? '' : 'none' }}>
        <div>URL: {blog.url}</div>
        <div>
          likes: {blog.likes}
          <button onClick={async () => handleLike(blog)}>like</button>
        </div>
        <div>Added by: {blog.user?.name ?? 'No data'}</div>
        {(user?.username || '') === blog.user?.username && <button onClick={async () => handleRemove(blog)}>remove</button>}
      </div>
    </div>
  )
}

export default Blog