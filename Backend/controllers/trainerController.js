const Trainer = require('../models/Trainer');
const imagekit = require('../utils/imagekit');

exports.addTrainer = async (req, res) => {
    try {
        const { name, specialization, age, gender, city, taluk, contact, email, instagram, experience, status } = req.body;
        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                return imagekit.upload({
                    file: file.buffer,
                    fileName: `trainer_${Date.now()}_${file.originalname}`,
                    folder: "/FitNadu/Trainers"
                });
            });
            const responses = await Promise.all(uploadPromises);
            imageUrls = responses.map(response => response.url);
        }

        if (req.body.existingImages) {
            const existingImagesArray = JSON.parse(req.body.existingImages);
            imageUrls = [...existingImagesArray, ...imageUrls];
        }

        const newTrainer = new Trainer({ 
            name, specialization, age, gender, city, taluk, contact, email, instagram, experience, status, 
            images: imageUrls 
        });
        
        await newTrainer.save();
        res.status(201).json({ success: true, message: 'Trainer added successfully', trainer: newTrainer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.status(200).json({ success: true, trainers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getTrainerById = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) {
            return res.status(404).json({ success: false, message: 'Trainer not found' });
        }
        res.status(200).json({ success: true, trainer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteTrainer = async (req, res) => {
    try {
        await Trainer.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Trainer deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateTrainer = async (req, res) => {
    try {
        const { name, specialization, age, gender, city, taluk, contact, email, instagram, experience, status } = req.body;
        let imageUrls = [];
        
        if (req.body.existingImages) {
            imageUrls = JSON.parse(req.body.existingImages);
        }

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                return imagekit.upload({
                    file: file.buffer,
                    fileName: `trainer_${Date.now()}_${file.originalname}`,
                    folder: "/FitNadu/Trainers"
                });
            });
            const responses = await Promise.all(uploadPromises);
            const newUrls = responses.map(response => response.url);
            imageUrls = [...imageUrls, ...newUrls];
        }

        const updateData = { name, specialization, age, gender, city, taluk, contact, email, instagram, experience, status, images: imageUrls };
        const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        res.status(200).json({ success: true, message: 'Trainer updated successfully', trainer: updatedTrainer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};