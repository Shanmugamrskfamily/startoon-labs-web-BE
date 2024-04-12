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
            user.loginCounts = totalLoginCounts;
        });

        res.status(200).json({ users });
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getUserLoginActivity(req, res) {
    try {
        // Check if the user is an admin
        if (req.user.userRole !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only Admin users can access this resource.' });
        }

        // Aggregate login counts by date
        const loginActivity = await User.aggregate([
            {
                $unwind: '$loginCounts' // Flatten the loginCounts array
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$loginCounts.loginDate' } },
                    totalLoginCounts: { $sum: '$loginCounts.count' }
                }
            },
            {
                $sort: { _id: 1 } // Sort by date in ascending order
            }
        ]);

        res.status(200).json({ loginActivity });
    } catch (error) {
        console.error('Error getting user login activity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


async function getUserStats(req, res) {
    try {
        // Check if the user is an admin
        if (req.user.userRole !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only Admin users can access this resource.' });
        }

        // Fetch all users excluding those with the role 'Admin'
        const users = await User.find({ role: { $ne: 'Admin' } }, 'loginCounts');

        // Calculate the total number of users
        const totalUsers = users.length;

        // Calculate the cumulative total login counts
        let cumulativeTotalLoginCounts = 0;
        users.forEach(user => {
            user.loginCounts.forEach(countEntry => {
                cumulativeTotalLoginCounts += countEntry.count;
            });
        });

        res.status(200).json({ totalUsers, cumulativeTotalLoginCounts });
    } catch (error) {
        console.error('Error getting user statistics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getAllUsers, getUserLoginActivity,getUserStats };
