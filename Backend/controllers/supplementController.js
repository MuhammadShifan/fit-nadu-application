const Supplement = require('../models/Supplement');
const imagekit = require('../utils/imagekit');

exports.addSupplement = async (req, res) => {
    try {
        const { name, description, websiteUrl, status } = req.body;
        let imageUrl = '';

        if (req.file) {
            const response = await imagekit.upload({
                file: req.file.buffer,
                fileName: `supplement_${Date.now()}_${req.file.originalname}`,
                folder: "/FitNadu/Supplements"
            });
            imageUrl = response.url;
        }

        const newSupplement = new Supplement({ 
            name, description, websiteUrl, status, 
            image: imageUrl 
        });
        
        await newSupplement.save();
        res.status(201).json({ success: true, message: 'Supplement added successfully', supplement: newSupplement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getAllSupplements = async (req, res) => {
    try {
        const supplements = await Supplement.find();
        res.status(200).json({ success: true, supplements });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteSupplement = async (req, res) => {
    try {
        await Supplement.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Supplement deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateSupplement = async (req, res) => {
    try {
        const { name, description, websiteUrl, status, existingImage } = req.body;
        let imageUrl = existingImage || '';

        if (req.file) {
            const response = await imagekit.upload({
                file: req.file.buffer,
                fileName: `supplement_${Date.now()}_${req.file.originalname}`,
                folder: "/FitNadu/Supplements"
            });
            imageUrl = response.url;
        }

        const updateData = { name, description, websiteUrl, status, image: imageUrl };
        const updatedSupplement = await Supplement.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        res.status(200).json({ success: true, message: 'Supplement updated successfully', supplement: updatedSupplement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};