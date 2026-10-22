const Notification = require('../models/Notification');
const User = require('../models/User'); 
const axios = require('axios'); 

// 1. Puthusa add panna API - Create and Send Push Notification
exports.createNotification = async (req, res) => {
    try {
        const { title, message, userId } = req.body; 

        if (!userId) {
            return res.status(400).json({ success: false, message: 'userId is required' });
        }

        const newNotification = new Notification({
            userId: userId, 
            title: title || 'FitNadu Update',
            message: message,
            isRead: false
        });
        await newNotification.save();

        const user = await User.findById(userId);
        if (user && user.expoPushToken) {
            const pushMessage = {
                to: user.expoPushToken,
                sound: 'default',
                title: title || 'FitNadu',
                body: message,
                data: { screen: 'Notifications' },
            };
            await axios.post('https://exp.host/--/api/v2/push/send', pushMessage);
        }

        res.status(201).json({ success: true, message: 'Push notification sent successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// --- Pazhaiya APIs --- //

exports.getNotifications = async (req, res) => {
    try {
        const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
        await Notification.deleteMany({ 
            createdAt: { $lt: oneHourAgo } 
        });

        const notifications = await Notification.find({}).sort({ createdAt: -1 });
        const unreadCount = await Notification.countDocuments({ isRead: false });

        res.status(200).json({ success: true, notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { isRead: true });
        res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// 👇 MISS AANA DELETE FUNCTION INGA ADD PANNIYACHU 👇
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNotification = await Notification.findByIdAndDelete(id);
        
        if (!deletedNotification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        
        res.status(200).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};