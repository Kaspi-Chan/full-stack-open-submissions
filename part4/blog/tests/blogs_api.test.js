const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const api = supertest(app)
const PASSWORD = "sekret";
const USERNAME = 'root'

const addDummyUser = async () => {
  const passwordHash = await bcrypt.hash(PASSWORD, 10)
  return new User({ username: USERNAME, passwordHash })
}

const signInUser = async () => {
  const user = await User.findOne({username: USERNAME});

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )

  return { token, username: user.username }
}

describe("blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = await addDummyUser()
    const blogs = helper.initialBlogs.map(b => ({ ...b, user: user._id }))
    const inserted = await Blog.insertMany(blogs)
    user.blogs = inserted.map(b => b._id)
    await user.save()
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

    const { token, username } = await signInUser()

    const res = await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    
    const addedBlog = blogsAtEnd.find(b => b.id === res.body.id);

    assert.partialDeepStrictEqual(addedBlog, newBlog);
  })

  test('likes property defaults to 0 if missing', async () => {
    const newBlog = {
      "title": "Test Blog",
      "author": "Test Testovich",
      "url": "api/blog/",
    }

    const { token, username } = await signInUser()

    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(b => b.id === res.body.id);

    assert.equal(addedBlog.likes, 0);
  })

  test('missing title or url fails request', async () => {
    const newBlogWithoutTitle = {
      "author": "Test Testovich",
      "url": "api/blog/",
    }

    const newBlogWithoutUrl = {
      "title": "Test Blog",
      "author": "Test Testovich",
    }

    const { token, username } = await signInUser()

    const res1 = await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlogWithoutTitle)
      .expect(400)

    const res2 = await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlogWithoutUrl)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('successfully delete an entry', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const postToDelete = blogsAtStart[0];

    const { token, username } = await signInUser()

    await api
      .delete(`/api/blogs/${postToDelete.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb()
    const entryExists = !!blogsAtEnd.find(post => post.id === postToDelete.id);

    assert.strictEqual(entryExists, false)
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
  })

  test('update the likes of a post', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const newLikes = 50
    const newBlog = {...blogToUpdate, likes: newLikes }

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)

    const updatedLikes = updatedBlog.body.likes;

    assert.strictEqual(updatedLikes, newLikes)
  })

  test('adding new blog without being authenticated fails', async () => {
    const newBlog = {
      "title": "Test Blog",
      "author": "Test Testovich",
      "url": "api/blog/",
      "likes": 5,
    }

    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('New users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = await addDummyUser()
    await user.save()
  })

  test('without username or password are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const userWithNoUsername = {
      name: "Test",
      password: "12345"
    }

    const userWithNoPassword = {
      name: "Test",
      username: "testtt",
    }

    const result = await api
      .post('/api/users')
      .send(userWithNoUsername)
      .expect(400)

    const result2 = await api
      .post('/api/users')
      .send(userWithNoPassword)
      .expect(400)
    
    assert(result.body.error.includes('must provide username and password'))
    assert(result2.body.error.includes('must provide username and password'))
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('with invalid username are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserWithBadUsername = {
      name: "Test",
      username: 't2',
      password: "12345"
    }

    const result = await api
      .post('/api/users')
      .send(newUserWithBadUsername)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('shorter than the minimum allowed length'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('with invalid password are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserWithBadPassword = {
      name: "Test 2",
      username: 'test',
      password: "12"
    }

    const result = await api
      .post('/api/users')
      .send(newUserWithBadPassword)
      .expect(400)

    assert(result.body.error.includes('shorter than the minimum allowed length'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('with dublicated usernames are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: "Test 3",
      username: 'root',
      password: '3213412',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close();
})