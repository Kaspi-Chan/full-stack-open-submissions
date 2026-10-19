const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { identity } = require('lodash')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the correct amount of blog posts are returned', async () => {
  const response = await api.get('/api/blogs')
  
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs');
  
  const firstBlog = response.body[0];
  const isId = Object.hasOwn(firstBlog, 'id');

  assert(isId);
})

test('a valid blog can be added', async () => {
  const newBlog = {
    "title": "Test Blog",
    "author": "Test Testovich",
    "url": "api/blog/",
    "likes": 5,
  }

  const res = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  
  const addedBlog = blogsAtEnd.find(b => b.id === res.body.id);

  assert.partialDeepStrictEqual(addedBlog, newBlog);
})

after(async () => {
  await mongoose.connection.close();
})