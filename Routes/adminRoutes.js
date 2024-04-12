const express = require('express');
const { middleware } = require('../Configuration/middleware');
const { getAllUsers, getUserLoginActivity, getUserStats } = require('../Controller/adminController');

const adminRouter=express.Router();

adminRouter.get('/get-users',middleware,getAllUsers);
adminRouter.get('/get-login-activity',middleware,getUserLoginActivity);
adminRouter.get('/get-user-stats',middleware,getUserStats);

module.exports = adminRouter;