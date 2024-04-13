const express = require('express');
const { middleware } = require('../Configuration/middleware');
const { getUserData } = require('../Controller/userController');

const userRouter=express.Router();

userRouter.get('/get-user',middleware,getUserData);

module.exports=userRouter;