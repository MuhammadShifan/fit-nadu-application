const express = require('express');
const router = express.Router();
const Gym = require('../models/Gym');
const Trainer = require('../models/Trainer');
const Supplement = require('../models/Supplement');
const User = require('../models/User'); 

router.get('/stats', async (req, res) => {
    try {
        // Fetch all counts in parallel for performance
        const [
            totalGyms, activeGyms, pendingGyms, suspendedGyms,
            totalTrainers, activeTrainers,
            totalSupplements, activeSupplements,
            totalUsers
        ] = await Promise.all([
            Gym.countDocuments(), Gym.countDocuments({ status: 'Active' }), Gym.countDocuments({ status: 'Pending' }), Gym.countDocuments({ status: 'Suspended' }),
            Trainer.countDocuments(), Trainer.countDocuments({ status: 'Active' }),
            Supplement.countDocuments(), Supplement.countDocuments({ status: 'Active' }),
            User.countDocuments() 
        ]);

        // Fetch recent activities (e.g., last 2 gyms added)
        const recentGyms = await Gym.find().sort({ createdAt: -1 }).limit(2);
        
        // Formatting recent activities for frontend
        const recentActivities = [
            ...recentGyms.map(gym => ({
                id: gym._id,
                title: 'New gym added',
                desc: `${gym.name} (${gym.city})`,
                time: gym.createdAt,
                type: 'gym'
            }))
        ];

        // Sort combined activities by time
        recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Mock chart data (you can make this dynamic later based on created dates)
        const userGrowthData = [
            { name: 'May', users: Math.floor(totalUsers * 0.5) },
            { name: 'Jun', users: Math.floor(totalUsers * 0.6) },
            { name: 'Jul', users: Math.floor(totalUsers * 0.75) },
            { name: 'Aug', users: Math.floor(totalUsers * 0.85) },
            { name: 'Sep', users: Math.floor(totalUsers * 0.95) },
            { name: 'Oct', users: totalUsers }
        ];

        // Fetch top gyms (Mocking revenue for now, using real gym names)
        const topGyms = await Gym.find({ status: 'Active' }).limit(5);

        res.status(200).json({
            success: true,
            stats: {
                gyms: { total: totalGyms, active: activeGyms, pending: pendingGyms, suspended: suspendedGyms },
                trainers: { total: totalTrainers, active: activeTrainers },
                supplements: { total: totalSupplements, active: activeSupplements },
                users: { total: totalUsers }
            },
            recentActivities,
            chartData: userGrowthData,
            topGyms: topGyms.map(g => ({ name: g.name, location: g.city, users: g.membersCount || 0, revenue: '₹ 0' })) // Modify revenue logic as needed later
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
    }
});

module.exports = router;