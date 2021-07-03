const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const signale = require('signale');

const database = require('./config/database');
const userRouter = require('./api/user/user.routes');

const app = express();

dotenv.config({ path:' ./config.env' });
//connect database
database.connect(process.env.MONGODB_URI)

// middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    signale.success('Hello my friend !!!');
    next();
  });

app.use('/user', userRouter);


  module.exports = app;
