import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


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
    } catch {
      console.error('Wrong credentials')
    }
    console.log('logging in with', username, password)
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault();
   
    if (title === '' || author === '' || url === '') return;

    const newBlog = await blogService.createBlog({title, author, url})
    setBlogs(blogs.concat(newBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
  }
 
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
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
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <h2>Create new</h2>
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
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App