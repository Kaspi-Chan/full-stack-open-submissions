import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Nottificaton from './components/Nottificaton'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [nottificaitonMessage, setNottificaitonMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const [showBlogForm, setShowBlogForm] = useState(false);
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    // sign in here
    const loggedInUser = window.localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user);
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({username, password});
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user);
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      handleNottification(`${user.name} successfully logged in !`, false)
    } catch {
      handleNottification(`Wrong username or password`, true)
    }

    console.log('logging in with', username, password)
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
  }

  const resetNottification = (time = 5000) => {
    setTimeout(() => {
      setNottificaitonMessage(null)
    }, time)
  }

  const handleNottification = (message, isError, time) => {
    setIsError(isError)
    setNottificaitonMessage(message);
    resetNottification(time && time)
  }

  const addBlog = async (blogInfo) => {
    try {
      const newBlog = await blogService.createBlog(blogInfo)
      setBlogs(blogs.concat(newBlog))
      handleNottification(`a new blog "${newBlog.title}"! by ${newBlog.author} added`, false)
      setShowBlogForm(false);
      return true;
    } catch (error) {
      handleNottification(`Couldn't create new blog: ${error}`, true)
      return false
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.updateLikes({...blog, likes: blog.likes + 1})
      setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
      handleNottification(`Likes of blog: ${blog.title} updated!`, false)
    } catch (error) {
      handleNottification(`Couldn't update likes: ${error}`, true)
    }
  }

  const handleRemove = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title}! By ${blog.author}`)) return;

    try {
      await blogService.deleteBlog(blog.id);
      setBlogs(blogs.filter(b => b.id !== blog.id))
      handleNottification(`Blog removed!`, false)
    } catch (error) {
      handleNottification(`Couldn't remove blog: ${error}`, true)
    }
  }
 
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Nottificaton message={nottificaitonMessage} isError={isError} />
        <form onSubmit={handleLogin}>
          <div>
          <label>
            username
            <input 
              type='text' 
              value={username}
              onInput={({target}) => setUsername(target.value)} />
          </label>
          </div>
          <div>
          <label>
            password
            <input 
              type='password' 
              value={password}
              onInput={({target}) => setPassword(target.value)} />
          </label>
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Nottificaton message={nottificaitonMessage} isError={isError} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable
         label="create new blog" 
         visible={showBlogForm}
         setVisible={setShowBlogForm}>
        <h2>Create new</h2>
        <BlogForm addBlog={addBlog} handleNottification={handleNottification} />
      </Togglable>
      
      {sortedBlogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog}
          handleLike={handleLike}
          handleRemove={handleRemove}
          user={user} />
      )}
    </div>
  )
}

export default App