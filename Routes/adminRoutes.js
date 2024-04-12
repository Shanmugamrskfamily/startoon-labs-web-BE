const express = require('express');
const { middleware } = require('../Configuration/middleware');
const { getAllUsers } = require('../Controller/adminController');

const adminRouter=express.Router();

adminRouter.get('/get-users',middleware,getAllUsers);

module.exports = adminRouter;