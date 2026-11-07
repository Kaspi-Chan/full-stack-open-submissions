const postsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

postsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs)
})

postsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'must provide title and url'
    });
  }

  const user = request.user

  const newBlog = new Blog({
    ...body,
    user: user._id
  })

  const savedBlog = await newBlog.save();
  await savedBlog.populate('user');
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  
  response.status(201).json(savedBlog)
})

postsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id);
  
  if (!blog) return response.status(404).json({ error: "Blog doesn't exists"})

  if (!blog.user || blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: "Blog doesn't belong to this user" })
  }
  
  await blog.deleteOne()
  user.blogs = user.blogs.filter(b => !b.equals(blog._id))
  await user.save();
  response.status(204).end()
})

postsRouter.put('/:id', userExtractor, async (request, response) => {
  const { content, likes } = request.body;

  const blogToUpdate = await Blog.findById(request.params.id);
  if (!blogToUpdate) return response.status(404).json({ error: "Blog doesn't exists"})

  blogToUpdate.likes = likes;

  const updatedBlog = await blogToUpdate.save();
  await updatedBlog.populate('user');
  response.json(updatedBlog);
})

module.exports = postsRouter;