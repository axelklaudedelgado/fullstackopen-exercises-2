import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
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

  const addBlog = async (blogObject) => {
    const blogItem = await blogService.create(blogObject)
    setBlogs(blogs.concat(blogItem))
    setNotificationMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const incrementLikes = async (id, blogObject) => {
    const updatedBlogItem = await blogService.update(id, blogObject)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlogItem))
  }

  const deleteBlog = async (id) => {
    await blogService.deleteBlog(id);
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

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
      <Togglable buttonLabel={'create new blog'}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs
      .sort((a, b) => b.likes - a.likes)
      .map(blog => (
        blog.user.id === user.id 
          ? <Blog key={blog.id} blog={blog} updateLikes={incrementLikes} removeBlog={deleteBlog} deleteButton={true} /> 
          : <Blog key={blog.id} blog={blog} updateLikes={incrementLikes} /> 
      ))}
    </div>
  )
}

export default App