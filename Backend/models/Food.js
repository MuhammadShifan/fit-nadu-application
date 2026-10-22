const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    aliases: { type: [String], default: [] },
    kcal: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fibre: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);