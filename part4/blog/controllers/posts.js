const postsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

postsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs)
})

postsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'must provide title and url'
    });
  }

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({
      error: "invalid token"
    })
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  const newBlog = new Blog({
    ...body,
    user: user._id
  })

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  
  response.status(201).json(savedBlog)
})

postsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

postsRouter.put('/:id', async (request, response) => {
  const { content, likes } = request.body;

  const blogToUpdate = await Blog.findById(request.params.id);
  if (!blogToUpdate) return response.status(404).end();

  blogToUpdate.likes = likes;

  const updatedBlog = await blogToUpdate.save();
  response.json(updatedBlog);
})

module.exports = postsRouter;