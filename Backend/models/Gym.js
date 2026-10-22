const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: 'Strength & Fitness' },
    city: { type: String, required: true },
    taluk: { type: String, required: true },
    owner: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, default: '' },
    established: { type: String, default: '' },
    address: { type: String, default: '' },
    latitude: { type: String, default: '' }, 
    longitude: { type: String, default: '' }, 
    membersCount: { type: String, default: '0' },
    trainersCount: { type: String, default: '0' },
    equipmentsCount: { type: String, default: '0' },
    facilities: [{ type: String }], 
    status: { type: String, default: 'Active' },
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Gym', gymSchema);