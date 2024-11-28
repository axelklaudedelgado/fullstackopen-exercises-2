import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage('Wrong username or password')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    const blogItem = await blogService.create(blogObject)
    setBlogs(blogs.concat(blogItem))
    setNotificationMessage(`a new blog ${title} by ${author} added`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
    setTitle('')
    setAuthor('')
    setURL('')
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogForm = () => (
  <>
    <h2>create new</h2>
    <form onSubmit={addBlog}>
      <div>
        title
          <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          required
        />
      </div>
      <div>
        author
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          required
        />
      </div>
      <div>
        url
          <input
          type="text"
          value={url}
          name="URL"
          onChange={({ target }) => setURL(target.value)}
          required
        />
      </div>
      <button type="submit">create</button>
    </form>  
  </>
  )

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notificationMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} color={'green'}/>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p> 
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App