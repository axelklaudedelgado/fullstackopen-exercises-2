import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setURL('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
                    title
          <input
            data-testid='title'
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
            data-testid='author'
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
            data-testid='url'
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setURL(target.value)}
            required
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm