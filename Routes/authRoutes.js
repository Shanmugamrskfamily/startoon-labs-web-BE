const express = require('express');
const { signup } = require('../Controller/authController');
const authRouter = express.Router();

authRouter.post('/signup', signup);

module.exports = authRouter;
