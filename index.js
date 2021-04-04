const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
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


app.listen(config.PORT,()=>{
    console.log(`Listening at http://localhost:${config.PORT}`);
});

module.exports = app