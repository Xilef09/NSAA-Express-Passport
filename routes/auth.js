const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const config = require('../config.js');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const { deleteOne } = require('../models/User');

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://github.com/login/oauth/authorize',
    tokenURL: 'https://github.com/login/oauth/access_token',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb, done) {
    // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    if (profile) {
        return done(null, profile);
    }
    return done(null, err);
  }
));

router.get('/github', passport.authenticate('oauth2', {session: false}));

router.get('/github/callback', passport.authenticate('oauth2' , {session: false, failureRedirect: '/login'}), 
    function (req,res) {
        //res.redirect('/');
    }
);

module.exports = router;