const passport = require('passport')
const { UserModel } = require('../models/user')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const localStrategy = require('passport-local').Strategy

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    }, 
    async (username, password, done) => {
      try {
        const user = await UserModel.findByLogin(username)

        if (!user) {
          return done(null, false, { message: 'User not found' })
        }

        const match = user.validate(password)
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

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.secret,
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user)
      } catch (error) {
        done(error)
      }
    }
  )
)