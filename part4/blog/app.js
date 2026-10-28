const express = require('express')
const mongoose = require('mongoose')
const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const postsRouter = require('./controllers/posts')
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware')

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.json())
app.use('/api/blogs', postsRouter);
app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;