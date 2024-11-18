const mongoose = require('mongoose')
require('dotenv').config()

const password = process.argv[2]
if (!password) {
  console.error('Please provide the MongoDB password as an argument')
  process.exit(1)
}

const url = process.env.MONGODB_URI.replace('<PASSWORD>', password)

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[3]

const number = process.argv[4]

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length === 5) {
  person.save().then(result => {
    console.log(`added ${name} ${number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 4) {
  console.log('give number as argument')
  process.exit(1)
} else if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result =>
  {result.forEach(person => {
    console.log(`${person.name} ${person.number}`)
  })
  mongoose.connection.close()
  })
}