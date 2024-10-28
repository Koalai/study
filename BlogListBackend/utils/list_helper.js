const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((acc, blog) => {
        return acc + blog.likes
      }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? []
    : blogs.reduce((max, blog) => {
        return blog.likes > max.likes ? blog : max
      })
}

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, "author")
  const authorMostBlogs = _.maxBy(Object.keys(authorCounts), author => authorCounts[author])

  return blogs.length === 0
    ? {}
    : {
      author: authorMostBlogs,
      blogs:  authorCounts[authorMostBlogs]
    }
}

const mostLikesBlog = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const authorCounts = _.map(groupedByAuthor, (blogs, author) => ({
    author: author,
    likes: blogs.reduce((acc, blog) => acc + blog.likes, 0)
  }))
  const topLikedBlogs = _.maxBy(authorCounts, 'likes')
  return blogs.length === 0 ? {} : topLikedBlogs
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikesBlog
}
