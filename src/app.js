const express = require('express');
const morgan = require('morgan');
const signale = require('signale');

const userRouter = require('./api/user/user.routes');

const app = express();

// middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/user', userRouter);


  module.exports = app;
