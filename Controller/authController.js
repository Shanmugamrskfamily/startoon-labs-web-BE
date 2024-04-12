const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../Models/userModel');

async function signup(req, res) {
    try {
        const { name, password, email, gender } = req.body;

        // Data validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!validator.isStrongPassword(password, { minLength: 8, maxLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            return res.status(400).json({ message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol, and be between 8 and 12 characters long" });
        }
        
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
            gender,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Data validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

// Update login dates and counts
if (user.role !== 'Admin') {
    const today = new Date().toDateString();
    const lastLoginDate = user.lastLogin ? user.lastLogin.toDateString() : null;

    if (lastLoginDate !== today) {
        user.loginCounts.push({ loginDate: user.lastLogin, count: 1 });
    } else {
        const index = user.loginCounts.findIndex(entry => entry.loginDate.toDateString() === today);

        if (index !== -1) {
            user.loginCounts[index].count += 1;
        } else {
            user.loginCounts.push({ loginDate: user.lastLogin, count: 1 });
        }
    }
}

user.lastLogin = new Date();
await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function changePassword(req, res) {
    try {

        const email=req.user.email;
        const { currentPassword, newPassword } = req.body;


        // Data validation
        if (!validator.isStrongPassword(password, { minLength: 8, maxLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            return res.status(400).json({ message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol, and be between 8 and 12 characters long" });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the current password is correct
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports={signup,login,changePassword};