const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const {initialBlogs} = require('./test_helper');

test('dummy returns one', () => {
  const result = listHelper.dummy(initialBlogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of all blog entries', () => {
    const result = listHelper.totalLikes(initialBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('of all blog entries', () => {
    const result = listHelper.favoriteBlog(initialBlogs)
    assert.deepStrictEqual(result, initialBlogs[2])
  })
})

describe('Author', () => {
  test('has the most blogs', () => {
    const result = listHelper.mostBlogs(initialBlogs)
    assert.deepStrictEqual(result, {
        author: "Robert C. Martin",
        blogs: 3
    })
  })

  test('has the most likes', () => {
    const result = listHelper.mostLikes(initialBlogs)
    assert.deepStrictEqual(result, {
        author: "Edsger W. Dijkstra",
        likes: 17
    })
  })
})