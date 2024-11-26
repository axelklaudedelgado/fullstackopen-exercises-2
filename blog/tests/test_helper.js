const Blog = require('../models/blog')
const User = require('../models/user')

const getBlogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  getBlogsInDB,
  usersInDb,
}