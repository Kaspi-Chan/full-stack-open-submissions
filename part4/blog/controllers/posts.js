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