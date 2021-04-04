const express = require('express');
const passport = require('passport');
const router = express.Router();
const JwtStrategy = require('passport-jwt').Strategy;
const config = require('../config');
const fortune = require('fortune-teller');
const path = require('path');

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

router.get('/', passport.authenticate('jwt',{session : false, failureRedirect:'/login'}), (req,res)=>{
    res.send(fortune.fortune());
})
module.exports = router;