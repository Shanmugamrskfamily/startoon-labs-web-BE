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

        // Calculate the date 15 days ago
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        // Aggregate login counts by date
        const loginActivity = await User.aggregate([
            // Unwind the loginCounts array
            { $unwind: '$loginCounts' },

            // Match login dates within the last 15 days
            { $match: { 'loginCounts.loginDate': { $gte: fifteenDaysAgo } } },

            // Group by date and sum up login counts
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$loginCounts.loginDate' } },
                    totalLoginCounts: { $sum: '$loginCounts.count' }
                }
            },

            // Sort by date in ascending order
            { $sort: { _id: 1 } }
        ]);

        // Create an object to store login counts for the last 15 days
        const loginActivityMap = new Map();
        loginActivity.forEach(entry => {
            loginActivityMap.set(entry._id, entry.totalLoginCounts);
        });

        // Generate an array of dates for the last 15 days
        const last15Days = Array.from({ length: 15 }, (_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - index);
            return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        });

        // Fill in missing dates with a login count of 0
        const last15DaysData = last15Days.map(date => ({
            _id: date,
            totalLoginCounts: loginActivityMap.get(date) || 0
        }));

        res.status(200).json({ loginActivity: last15DaysData });
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
