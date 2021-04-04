const express = require('express');
const passport = require('passport');
const logger = require('morgan');
const LocalStrategy = require('passport-local').Strategy;

const path = require('path');
const jwt  = require('jsonwebtoken');
const jwtSecret= require('crypto').randomBytes(32);
const cookieParser = require('cookie-parser');
const JwtStrategy = require('passport-jwt').Strategy;

const fortune = require('fortune-teller');

const mongoose = require('mongoose');

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const fortuneRoute = require('./routes/fortune');
const logoutRoute = require('./routes/logout');
const config = require('./config')
const app = express();

const mongoDB = "mongodb://localhost:27017/nsaa_auth";

//BD
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once('open', function(){
    console.log('Connection to DB successful')
})

app.use(logger('dev'))
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended:true})); //Parse URL-encoded bodies
app.use(cookieParser());


app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/', fortuneRoute);
app.use('/logout', logoutRoute);
// const cookieExtractor = req => {
//     let jwt = null 

//     if (req && req.cookies) {
//         jwt = req.cookies['auth']
//     }
    
//     return jwt;
// }

// passport.use('jwt', new JwtStrategy({
//     jwtFromRequest: cookieExtractor,
//     secretOrKey: jwtSecret
// }, async (token, done) => {
//     try {
//         const { expiration } = token
    
//         if (Date.now() > expiration) {
//             done('Unauthorized', false)
//         }
        
//         return done(null, token)
//     }
//     catch (error) {
//         done(error);
//     }
    
// }))

// passport.use('local',new LocalStrategy(
//     {
//         usernameField: 'username',
//         passwordField: 'password',
//         session:false
//     },(username,password,done)=>{
//         if(username === 'walrus' && password === 'walrus'){
//             const user = {
//                 username:'walrus',
//                 description:'descripción'
//             }
//             return done(null,user);
//         }
//         return done(null,false);
//     }
// ));

// app.use(passport.initialize());
// const myLogger = (req,res,next)=>{
//      console.log(req)
//      next();
// }


// app.use((err,req,res,next)=>{
//     console.log(err.stack);
//     res.status(500).send('There was an error')
// });
// app.use(myLogger);

// app.get('/', passport.authenticate('jwt',{session : false, failureRedirect: '/login'}), (req,res)=>{
//     res.send(fortune.fortune());
// })


// app.get('/user',(req,res)=>{
//     const user = {
//         username:"walrus",
//         description:"description"
//     }
//     res.json(user)
// });

// app.get('/login',(req,res)=>{
//     res.sendFile(path.join(__dirname,"login.html"));
// });

// app.post('/login', passport.authenticate('local',{session : false,failureRedirect: '/login'}),(req,res)=>{
//     const payload ={
//         iss: config.iss,
//         sub: req.user.username,
//         aud: config.aud,
//         exp: Math.floor(Date.now() / 1000) + 604800
//     }
//     const token = jwt.sign(payload,jwtSecret);
//     // res.send(`heloo  ${req.user.username} and token ${token}`);
//     res.cookie('auth', token, {httpOnly:true});
//     res.redirect("/");
// })

app.listen(config.PORT,()=>{
    console.log(`Listening at http://localhost:${config.PORT}`);
});

module.exports = app