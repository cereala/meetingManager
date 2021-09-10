import Strategy from 'passport-local'
import bcrypt from 'bcryptjs'

import User from '../models/User.js'

const LocalStrategy = Strategy.Strategy

export default function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            User.findOne({email: email})
                .then( user => {
                    if(!user){
                        return done(null, false, {message: 'That email is not registered!'})
                    } else {
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if(err) throw err
                            if(isMatch) {
                                return done(null, user)
                            } else {
                                return done(null, false, 'Password is not correct')
                            }
                        })
                    }
                })
                .catch( err => console.log(err))
        })
    )

    passport.serializeUser(function(user, done){
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err,user){
            done(err,user)
        })
    })

}
