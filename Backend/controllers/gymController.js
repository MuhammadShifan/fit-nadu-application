const Gym = require('../models/Gym');
const imagekit = require('../utils/imagekit');

exports.addGym = async (req, res) => {
    try {
        const { name, type, city, taluk, owner, contact, email, established, address, latitude, longitude, status, membersCount, trainersCount, equipmentsCount, facilities } = req.body;
        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const response = await imagekit.upload({
                    file: file.buffer,
                    fileName: `gym_${Date.now()}_${file.originalname}`,
                    folder: "/FitNadu/Gyms"
                });
                imageUrls.push(response.url);
            }
        }

        const newGym = new Gym({ 
            name, type, city, taluk, owner, contact, email, established, address, latitude, longitude, status,
            membersCount, trainersCount, equipmentsCount,
            facilities: facilities ? (Array.isArray(facilities) ? facilities : [facilities]) : [],
            images: imageUrls 
        });
        
        await newGym.save();
        res.status(201).json({ success: true, message: 'Gym added successfully', gym: newGym });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getAllGyms = async (req, res) => {
    try {
        const gyms = await Gym.find();
        res.status(200).json({ success: true, gyms });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getActiveGymsForApp = async (req, res) => {
    try {
        const gyms = await Gym.find({ status: 'Active' });
        res.status(200).json({ success: true, gyms });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getGymById = async (req, res) => {
    try {
        const gym = await Gym.findById(req.params.id);
        if (!gym) {
            return res.status(404).json({ success: false, message: 'Gym not found' });
        }
        res.status(200).json({ success: true, gym });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteGym = async (req, res) => {
    try {
        await Gym.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Gym deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateGym = async (req, res) => {
    try {
        const { name, type, city, taluk, owner, contact, email, established, address, latitude, longitude, status, existingImages, membersCount, trainersCount, equipmentsCount, facilities } = req.body;
        let imageUrls = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : [];

        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const response = await imagekit.upload({
                    file: file.buffer,
                    fileName: `gym_${Date.now()}_${file.originalname}`,
                    folder: "/FitNadu/Gyms"
                });
                imageUrls.push(response.url);
            }
        }

        const updateData = { 
            name, type, city, taluk, owner, contact, email, established, address, latitude, longitude, status,
            membersCount, trainersCount, equipmentsCount,
            facilities: facilities ? (Array.isArray(facilities) ? facilities : [facilities]) : [],
            images: imageUrls 
        };
        const updatedGym = await Gym.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        res.status(200).json({ success: true, message: 'Gym updated successfully', gym: updatedGym });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};