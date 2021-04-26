const express = require('express');
const passport = require('passport');
const router = express.Router();
const config = require('../config.js');
const Github2Strategy = require('passport-github2').Strategy;
const userController = require('../controllers/userController');

passport.use('github2', new Github2Strategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    if (profile) {
        return done(null, profile);
    }
    return done(null, err);
  }
));

router.get('/github', passport.authenticate('github2', {session: false, scope: ['user:email']}));

router.get('/github/callback', passport.authenticate('github2' , {session: false, failureRedirect: '/login'}), userController.login);

module.exports = router;