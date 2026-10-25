const postsRouter = require('express').Router();
const Blog = require('../models/blog');

postsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs)
})

postsRouter.post('/', async (request, response) => {
  const newBlog = await new Blog(request.body)
  
  if (!newBlog.title || !newBlog.url) {
    return response.status(400).json({
      error: 'must provide title and url'
    });
  }
  const savedBlog = await newBlog.save();
  response.status(201).json(savedBlog)
})

module.exports = postsRouter;