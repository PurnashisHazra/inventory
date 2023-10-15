// import all the things we need  
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

const PORT = 3000
const MONGO_URI='mongodb+srv://purnashis:purnashis@cluster0.kt5n8.mongodb.net/sportscom?authSource=admin&replicaSet=atlas-obxnrc-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
const GOOGLE_CLIENT_ID = '1095817107830-ffjlbdh9fikia782ieopac9db8hglio2.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        //get the user data from google 
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value
        }

        try {
          //find the user in our database 
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            //If user present in our database.
            done(null, user)
          } else {
            // if user is not preset in our database save user data to database.
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
