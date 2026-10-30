const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({
      error: 'must provide username and password'
    });
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'password is shorter than the minimum allowed length'
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    name,
    passwordHash,
  })
  
  const savedUser = await user.save();
  response.status(201).json(savedUser)
})

module.exports = usersRouter