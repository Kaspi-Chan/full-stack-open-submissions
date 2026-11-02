import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    // sign in here
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({username, password});
      setUsername('')
      setPassword('')
      setUser(user);
    } catch {
      console.error('Wrong credentials')
    }
    console.log('logging in with', username, password)
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
      <p>{user.name} logged in</p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App