const express = require('express');
const connectDB = require('./Configuration/database');
const authRouter = require('./Routes/authRoutes');
const adminRouter = require('./Routes/adminRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 4500;
const app = express();

app.use(express.json());
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get('/', async function(req, res) {
    res.send('This is Backend for Startoon Labs Web Application');
});

// Define routes for authentication and admin
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
