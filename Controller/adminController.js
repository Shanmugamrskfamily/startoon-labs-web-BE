const User = require('../Models/userModel');

async function getAllUsers(req, res) {
    try {
        // Check if the user is an admin
        if (req.user.userRole !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only Admin users can access this resource.' });
        }

        // Fetch all users with specified fields
        const users = await User.find({ role: { $ne: 'Admin' }}, 'name email gender loginCounts lastLogin');

        // Calculate the total login counts for each user
        users.forEach(user => {
            let totalLoginCounts = 0;
            user.loginCounts.forEach(countEntry => {
                totalLoginCounts += countEntry.count;
            });
            user.totalLoginCounts = totalLoginCounts;
        });

        res.status(200).json({ users });
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getAllUsers };
