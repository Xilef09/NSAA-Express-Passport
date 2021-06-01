const express = require('express');
const passport = require('passport');
const router = express.Router();
const config = require('../config.js');
const Github2Strategy = require('passport-github2').Strategy;
const userController = require('../controllers/userController');
const radius = require('radius');
const dgram = require('dgram');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

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

passport.use('radius', new LocalStrategy(
  {
      usernameField: 'username',
      passwordField: 'password',
      session:false
  },(username,password,done)=>{

      const packet = {
          code: "Access-Request",
          secret: config.RADIUS_SECRET,
          identifier: 0,
          attributes: [
            ['NAS-IP-Address', '127.0.0.1'],
            ['User-Name', username],
            ['User-Password', password]
          ]
        };
      const encoded = radius.encode(packet);
      const client = dgram.createSocket("udp4");
      client.send(encoded,0, encoded.length, config.RADIUS_PORT, "localhost");

      const user ={
          username: username,
      }
      const p = new Promise((resolve)=>{
          client.on('message', async function(msg, rinfo) {
              const decoded = radius.decode({packet: msg, secret: config.RADIUS_SECRET});
              const valid_response = radius.verify_response({
                  response: msg,
                  request: encoded,
                  secret: config.RADIUS_SECRET
              });
              client.close();
              if (valid_response) {
                  if(decoded.code == "Access-Accept"){
                      resolve(user);
                  }else{
                      resolve(false)
                  }
              }else{
                  resolve(false);
              }
  
          });
      });
      p.then((value)=>{
         return done(null,value);
      });
  }
));


router.get('/github', passport.authenticate('github2', {session: false, scope: ['user:email']}));

router.get('/github/callback', passport.authenticate('github2' , {session: false, failureRedirect: '/login'}), userController.login);

router.get('/radius', (req,res) => {
  res.sendFile(path.join(__dirname,"radius.html"));
});

router.post('/radius', passport.authenticate('radius',{session : false,failureRedirect: '/logout'}), userController.login);

module.exports = router;