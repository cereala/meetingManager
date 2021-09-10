import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import passport from 'passport'

const router = express.Router()

//Login Page
router.get('/login', (req, res) => res.render('login'))

//Register page
router.get('/register', (req, res) => res.render('register'))

//Registration handle
router.post('/register', (req, res) => {
    const {name, email, password, passwordCheck } = req.body
    let errors = []

    if(!name || !email || !password || !passwordCheck) {
        errors.push({msg: "Please fill all fields"})
    }

    if(password !== passwordCheck) {
        errors.push({msg: "Passwords don't match"})
    }

    if(password.length < 6) {
        errors.push({msg: "Too short password"})
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            passwordCheck
        })
    } else {
        User.findOne({email: email})
            .then(user => {
                if(user) {
                    // email already is used
                    errors.push({msg: "Email already used"})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        passwordCheck
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    bcrypt.genSalt(10,(err, salt) =>  {
                        if(err) throw err
                        bcrypt.hash(password,salt, (err, hash) => {
                            if(err) throw err
                            newUser.password = hash
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are registerd. Proceed to login')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        }) 
                    })
                }
            })
    }

})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are now logged out!')
    res.redirect('/users/login')
})

export default router