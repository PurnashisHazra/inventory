const express = require('express');
const mongoose=require('mongoose');
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const PORT = 3000
const MONGO_URI='mongodb+srv://purnashis:purnashis@cluster0.kt5n8.mongodb.net/sportscom?authSource=admin&replicaSet=atlas-obxnrc-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
const GOOGLE_CLIENT_ID = '1095817107830-ffjlbdh9fikia782ieopac9db8hglio2.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

var app=express();

dotenv.config({ path: './config/config.env' })
try{
mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
}catch(e){
console.log(e)
}
console.log("DB conected")

// Passport config
require('./config/passport')(passport)



// Middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.set('view engine','ejs');

app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )

  // Passport middleware
app.use(passport.initialize())
app.use(passport.session())


app.use(require("./routes/index"))
app.use('/auth', require('./routes/auth'))





app.listen(PORT,console.log(`listening at ${PORT}`))
