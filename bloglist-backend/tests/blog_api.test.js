require('dotenv').config()
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')

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

const token = process.env.TEST_TOKEN;

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
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test.only('fails with statuscode 401 if token is missing', async () => {

  const newBlog = {
    title: "Sey Cheese",
    author: "Chichis",
    url: "moimoi.com",
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer `)
    .send(newBlog)
    .expect(401)
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

test('a blog can be updated', async () => {
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

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('when an invalid user is created', () => {
  test('creation fails when username is shorter than minimum length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Ax',
      name: 'Axel',
      password: 'elknirk',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes(`User validation failed: username: Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3)`))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails when username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Axel',
      password: 'elknirk',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('User validation failed: username: Path `username` is required.'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails when password is shorter than minimum length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Axel',
      name: 'Axel',
      password: 'el',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('User validation failed: password: Path `password` is shorter than the minimum allowed length (3).'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails when password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Axel',
      name: 'Axel',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('User validation failed: password: Path `password` is required.'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})