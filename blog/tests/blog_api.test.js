const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const blog = require('../models/blog')

test('blogs are returned as json in the correct amount', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsinDB = await helper.getBlogsInDB()
  assert.strictEqual(blogsinDB.length, 2)
})

test('unique identifier property of the blog posts is named id', async () => {
  const blogs = await helper.getBlogsInDB()

  const allHaveIDKey = blogs.every(blog => 'id' in blog);

  assert.strictEqual(allHaveIDKey, true)
})

test('a blog can be added', async () => {
  const blogsAtStart = await helper.getBlogsInDB()

  const newBlog = {
    title: "Sey Cheese",
    author: "Chichis",
    url: "moimoi.com",
    likes: 192
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.getBlogsInDB()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
})

test('missing blog likes defaults to 0', async () => {

  const newBlog = {
    title: "Sey Cheese",
    author: "Chichis",
    url: "moimoi.com",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.getBlogsInDB()
  const latestBlog = blogsAtEnd.at(-1)
  assert.strictEqual(latestBlog.likes, 0)
})

test('fails with statuscode 400 if author or url is missing', async () => {

  const newBlog = {
    author: "Chichis",
    likes: 23
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.getBlogsInDB()
  const blogToDelete = blogsAtStart.at(-1)


  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.getBlogsInDB()

  const ids = blogsAtEnd.map(blog => blog.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test.only('a blog can be updated', async () => {
  const blogsAtStart = await helper.getBlogsInDB()
  const blogToUpdate = blogsAtStart.at(-1)
  
  const blogUpdate = {
    title: "Sey Cheese",
    author: "Chichis",
    url: "moimoi.com",
    likes: 26
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogUpdate)

  const blogsAtEnd = await helper.getBlogsInDB()

  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id);
  assert.strictEqual(updatedBlog.likes, 26);
})

after(async () => {
  await mongoose.connection.close()
})