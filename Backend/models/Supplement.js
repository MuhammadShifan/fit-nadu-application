const mongoose = require('mongoose');

const supplementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    status: { type: String, default: 'Active' },
    image: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Supplement', supplementSchema);