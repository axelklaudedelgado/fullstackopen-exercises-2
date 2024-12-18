import { useState } from 'react'

const Blog = ({ blog, updateLikes, removeBlog=null, deleteButton=false }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const incrementLikes = () => {
    updateLikes(
      blog.id,
      {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id
      }
    )
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`) === true) {
      removeBlog(blog.id)
    } else {
      alert('You canceled removal.')
    }
  }

  const initialState = () => (
    <div>
      <span data-testid='blog'>{blog.title} {blog.author} <button onClick={() => setVisible(true)}>view</button></span>
    </div>
  )

  const collapsedState = () => (
    <div>
      <p>{blog.title} <button onClick={() => setVisible(false)}>hide</button></p>
      <p>{blog.url}</p>
      <p>likes <span data-testid='likes'>{blog.likes}</span> <button className='likeBtn' onClick={incrementLikes}>like</button></p>
      <p>{blog.author}</p>
      {deleteButton && (
        <button onClick={deleteBlog}>
        remove
        </button>
      )}
    </div>
  )

  return (
    <div style={blogStyle} className='blog'>
      {!visible
        ? initialState()
        : collapsedState()}
    </div>
  )
}

export default Blog