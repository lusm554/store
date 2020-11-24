require('../auth/user')
const mongoose = require('mongoose')
const userRouter = require('express').Router()
const { userController: { User, signin } } = require('../controllers/userController')

userRouter.post('/signup', isFieldsExist, async (req, res) => {
  const { username, password } = req.user

  let user = new User(username, password)
  try {
    user = (await user.save()).fullInfo;
    if (user.error) {
      throw new Error(user.error)
    }
  } catch (err) {
    if (user.error instanceof mongoose.Error.ValidationError) {
      res.status(400).send('Validation failed.')
    } else {
      res.status(500).send('Error while creating new user.')
    }
    return;
  }

  res.status(200).json(user.user)
})

userRouter.post('/signin', signin)

function isFieldsExist(req, res, next) {
  const { password, username } = req.body

  if (!password || !username) {
    res.status(400).send('BAD REQUEST')
    return;
  }

  req.user = { username, password }
  next()
}

exports.userRouter = userRouter