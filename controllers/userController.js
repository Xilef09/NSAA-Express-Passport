const User = require("../models/User");
const config = require("../config.js");
const jwt  = require('jsonwebtoken');

class UserController {
  constructor() {}

  register(req, res, next) {
    let user = new User();
    user.username = req.body.username;
    user.password = req.body.password;

    if (JSON.stringify(req.body) == "{}") {
      return res.status(404).json({mesage: "Body empty"});
    } else {
      user.save((err, doc) => {
        if (!err) {
          return res.redirect('/login')
        } else {
          if (err.code == 11000) {
            return res.status(422).json({message:"Duplicate username found."});
          }
          return next(err);
        }
      });
    }
  }

  login(req, res) {
    const payload ={
      iss: config.ISS,
      sub: req.user.username,
      aud: config.AUD,
      exp: Math.floor(Date.now() / 1000) + 604800
    }
    const token = jwt.sign(payload, config.JWT_SECRET);
    // res.send(`heloo  ${req.user.username} and token ${token}`);
    res.cookie('auth', token, {httpOnly:true, secure:true});
    return res.redirect("/");
  }
}

module.exports = new UserController();