const express = require('express');
const connectDB=require('./Configuration/database');
require('dotenv').config();

const PORT =process.env.PORT || 4500;
const app = express();

app.use(express.json());
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});