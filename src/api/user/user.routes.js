const express = require('express');
const userController = require('./user.controller')

const router = express.Router();

router
    .route('/signup')
    .post(userController.signup);

router
    .route('/login')
    .post(userController.login);

router
    .route('/update-me')
    .patch(userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);

router
    .route('/upload-multi-photos')
    .patch(userController.uploadMultiPhotos, userController.resizeMultiPhotos, userController.saveMultiPhotos);

module.exports = router;