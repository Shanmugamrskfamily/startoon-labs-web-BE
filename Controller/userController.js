const User = require('../Models/userModel');

async function getUserData(req,res){
    const email=req.user.email;
    if(!email){
        return res.status(400).json({ message: "Email Not Found!" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User Not Found!" });
        }
        res.status(200).json({userName:user.name,role:user.role,email:user.email});
    } catch (error) {
        console.error("Error Finding User:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports={getUserData};