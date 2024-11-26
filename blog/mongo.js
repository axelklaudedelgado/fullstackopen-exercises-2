const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://axelklaudedelgado:${password}@fullstackopen-exercises.b8i42.mongodb.net/testBlogList?retryWrites=true&w=majority&appName=Fullstackopen-exercises`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
    title: "Harry Potter",
    author: "Chicheese",
    url: "hpotter.com",
    likes: 23
})

blog.save().then(result => {
  console.log('blog saved!')
})

Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog.toJSON()) 
  })
  mongoose.connection.close()
})

/* Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
}) */