var _ = require('lodash');

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc + curr.likes, 0)

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((acc, curr) => {
        if (curr.likes > acc.likes) {
            return curr;
        }

        return acc
    }, blogs[0])

    return favorite
}

const mostBlogs = (blogs) => {
    // Plain JS solution

    // const authorMap = new Map(); //<author, count>

    // const authorWithMostBlogs = {
    //     author: "",
    //     blogs: 0,
    // }

    // blogs.forEach((blog) => {
    //     const author = blog.author;
    //     const count = (authorMap.get(author) ?? 0) + 1
    //     authorMap.set(author, count);

    //     if (count > authorWithMostBlogs.blogs) {
    //         authorWithMostBlogs.author = author;
    //         authorWithMostBlogs.blogs = count;
    //     }
    // })

    // lodash solution
    const authorWithMostBlogs = _(blogs)
        .countBy('author')
        .map((blogs, author) => ({ author, blogs }))
        .maxBy('blogs')


    return authorWithMostBlogs
}

const mostLikes = (blogs) => {
    return _(blogs)
        .groupBy('author')
        .map((v) => {
            return {
                author: v[0].author, 
                likes: v.reduce((res, curr) => res + curr.likes , 0)
            };
        })
        .maxBy('likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}