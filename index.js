const express = require('express');
const connectDB = require('./Configuration/database');
const cors = require('cors');
const authRouter = require('./Routes/authRoutes');
const adminRouter = require('./Routes/adminRoutes');
const userRouter = require('./Routes/userRoutes');

require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 4500;

const corsOptions = {
    origin: [`http://localhost:${PORT}`, `https://startoons-web-app.netlify.app`],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

app.use(cors(corsOptions));

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
app.use('/user',userRouter);
