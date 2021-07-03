const express = require('express');
const userController = require('./user.controller')

const router = express.Router();

router
    .route('/signup')
    .post(userController.signup);

module.exports = router;