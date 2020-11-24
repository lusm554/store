const passport = require('passport')
const { UserModel } = require('../models/user')
const localStrategy = require('passport-local').Strategy

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false
    }, 
    async (username, password, done) => {
      try {
        const user = await UserModel.findByLogin(username)
        if (!user) {
          return done(null, false, { message: 'User not found' })
        }

        let match = await UserModel.validate(password, user.password)
        if (!match) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
)