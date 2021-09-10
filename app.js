import config from "./config/config.js";
import mongoose from "mongoose"
import express from 'express'
import index from './routes/index.js'
import users from './routes/users.js'
import events from './routes/events.js'
import expressLayouts from 'express-ejs-layouts'
import flash from 'connect-flash-plus'
import session from 'express-session'
import passport from 'passport'

const app = express()

// Mongo
const db = config.MONGODB_URI

mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('Mongo DB Atlas connected '))
.catch( err => console.log(err))

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(express.static('public'))

// body parser
app.use(express.urlencoded({extended: false}))

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

import pass from './config/passport.js' 
pass(passport)

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()

})


// Routes
app.use('/', index)
app.use('/users', users)
app.use('/events', events)

app.listen(config.PORT,
    console.log('Server running on port ' + config.PORT)
)