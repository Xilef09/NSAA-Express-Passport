const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController')
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require("../models/User");
const config = require('../config.js')

const cookieExtractor = req => {
    let jwt = null 

    if (req && req.cookies) {
        jwt = req.cookies['auth']
    }
   
    return jwt;
}

passport.use('jwt', new JwtStrategy({
            jwtFromRequest: cookieExtractor,
            secretOrKey: config.JWT_SECRET
        }, async (token, done) => {
            try {
                const { expiration } = token
            
                if (Date.now() > expiration) {
                    done('Unauthorized', false)
                }
                
                return done(null, token);
            }
            catch (error) {
                done(error);
            }
            
}));

passport.use('local',new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        session:false
    },(username,password,done)=>{
        User.findOne({ username: username }, (err, user) => {
            if (err) return done(err);
            else if (!user) return done("User not found");
            else if (!user.verifyPassword(password))
                return done("Password doesn't match");
            else if (user) {
                return done(null, user);
            }
            else return(null, false);
        });
    }
));

router.post('/', passport.authenticate('local',{session : false,failureRedirect: '/login'}), userController.login);

router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,"login.html"));
});

module.exports = router;