const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign(
                { role: 'admin', email: email },
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                success: true,
                message: 'Admin login successful',
                token
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid Admin Credentials'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const adminEmail = process.env.ADMIN_EMAIL;

        if (email === adminEmail) {
            return res.status(403).json({ message: 'Invalid user' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({ message: 'Login successful!', token, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.savePushToken = async (req, res) => {
    try {
        const { pushToken } = req.body;

        await User.findOneAndUpdate({}, { expoPushToken: pushToken });
        
        res.status(200).json({ success: true, message: 'Push token saved successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};