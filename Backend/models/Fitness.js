const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
    day: { type: String, required: true },
    workout: { type: String, default: '' }
});

const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    kcal: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fibre: { type: Number, default: 0 }
});

const fitnessSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    profile: {
        weight: { type: Number, default: 0 },
        height: { type: Number, default: 0 }
    },
    workoutPlan: [workoutPlanSchema],
    nutrition: {
        waterIntake: { type: Number, default: 0 },
        waterGoal: { type: Number, default: 0 },
        target: {
            kcal: { type: Number, default: 0 },
            protein: { type: Number, default: 0 },
            carbs: { type: Number, default: 0 },
            fibre: { type: Number, default: 0 }
        },
        consumed: {
            kcal: { type: Number, default: 0 },
            protein: { type: Number, default: 0 },
            carbs: { type: Number, default: 0 },
            fibre: { type: Number, default: 0 }
        },
        foodDiary: [foodItemSchema]
    }
}, { timestamps: true });

module.exports = mongoose.model('Fitness', fitnessSchema);