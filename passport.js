const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const config = require('./config')

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  User.findOne(
    { _id: id },
    (err, user) => {
      done(err, user)
    }
  )
})

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (username, password, done) => {
      User.findOne(
        { email: username },
        (err, user) => {
          if (err) return done(err)

          if (!user) {
            return done(null, false, {
              message: 'Incorrect username or password'
            })
          }

          if (!user.validPassword(password)) {
            return done(null, false, {
              message: 'Incorrect username or password'
            })
          }

          return done(null, user)
        }
      )
    }
  )
)

passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['id', 'displayName', 'email']
  }, (token, refreshToken, profile, done) => {
    User.findOne({ 'facebookId': profile.id }, (err, user) => {
      if (err) {
        return done(err)
      }

      // return the user if there is one associated with the facebookId
      if (user) {
        return done(null, user)
      } else {
        // if we cannot find the user by facebookId, check using email
        User.findOne({ email: profile.emails[0].value }, (err, user) => {
          if (user) {
            user.facebookId = profile.id

            return user.save((err) => {
              if (err) {
                return done(null, false, { message: "Can't save user" })
              } else {
                return done(null, user)
              }
            })
          }

          // if the user doesn't exist in database, create a new one
          const newUser = new User()
          newUser.name = profile.displayName
          newUser.email = profile.emails[0].value
          newUser.facebookId = profile.id

          newUser.save(err => {
            if (err) {
              return done(null, false, { message: "Can't save user" })
            } else {
              return done(null, user)
            }
          })
        })
      }
    })
  }
))