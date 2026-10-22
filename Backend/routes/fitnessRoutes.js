const express = require('express');
const router = express.Router();
const fitnessController = require('../controllers/fitnessController');
const authMiddleware = require('../middleware/authMiddleware'); // Unga project-la irukkura auth middleware file path-ah potkonga

// Ellaa routes-kum authMiddleware-ah sethu vittachu
router.get('/', authMiddleware, fitnessController.getFitnessData);
router.get('/search-food', authMiddleware, fitnessController.searchFood);
router.put('/profile', authMiddleware, fitnessController.updateProfile);
router.put('/water', authMiddleware, fitnessController.updateWaterIntake);
router.post('/food', authMiddleware, fitnessController.addFoodItem);
router.delete('/food/:foodId', authMiddleware, fitnessController.deleteFoodItem);

module.exports = router;