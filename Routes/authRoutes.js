const express = require('express');
const { signup, login, changePassword } = require('../Controller/authController');
const { middleware } = require('../Configuration/middleware');
const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/change-password',middleware,changePassword);

module.exports = authRouter;
