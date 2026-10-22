const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, default: 'General Fitness' },
    age: { type: String, default: '' },
    gender: { type: String, default: 'Male' },
    city: { type: String, required: true }, 
    taluk: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, default: '' },
    instagram: { type: String, default: '' },
    experience: { type: String, default: '1+ years' },
    status: { type: String, default: 'Active' },
    images: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);