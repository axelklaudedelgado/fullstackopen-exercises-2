const _ = require('lodash')

const dummy = (blogs) => {
    if(blogs) {
        return 1
    }
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const descendingLikes = [...blogs].sort((a, b) => {
        return b.likes - a.likes
    })
    
    return (({ title, author,likes }) => ({ title, author,likes }))(descendingLikes[0]);
}

const mostBlogs = (blogs) => {
    const result = _
    .chain(blogs)
    .countBy('author')
    .entries()
    .maxBy(_.last)
    .thru(([author, blogs]) => ({author, blogs}))
    .value()

    return result
}

const mostLikes = (blogs) => {
    const result = _
    .chain(blogs)
    .groupBy('author') 
    .map((likes, author) => ({
        author,
        likes: _.sumBy(likes, 'likes') 
    }))
    .maxBy('likes')
    .value()

    return result
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}