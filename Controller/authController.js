const bcrypt = require('bcrypt');
const User = require('../Models/userModel');

async function signup(req, res) {
    try {
        const { name, password, email, gender } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const newUser = new User({
            name,
            password: hashedPassword,
            email,
            gender
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports={signup}