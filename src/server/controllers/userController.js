const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { UserModel } = require('../models/user')

class User {
  constructor(username, password) {
    this.username = username
    this.password = password
    this.user = null
    this.error = null
  }

  async save() {
    await new Promise(async (resolve, reject) => {
      const salt = await bcrypt.genSalt(10)
      bcrypt.hash(this.password, salt).then( async (hash) => {
        new UserModel({ username: this.username, password: hash }).save((err, doc) => {
          if (err) {
            reject(err)
          } else {
            resolve(doc)
          }
        })
      })
    })
    .then((user) => {
      this.user = user
    })
    .catch((err) => {
      this.error = err
    })
    return this
  }

  get fullInfo() {
    return { 
      user: this.user,
      error: this.error
    }
  }
}

async function signin(req, res, next) {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        if (err) return next(err);
        if (!user) return res.status(400).send(info.message);

        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) return next(error);
        
            const {password, ...body} = user._doc
            const token = jwt.sign({ user: body }, process.env.secret)

            return res.json({ token, user: body })
          }
        )
      } catch (error) {
        return next(error)
      }
    }
  )(req, res, next);
}

exports.userController = { User, signin }