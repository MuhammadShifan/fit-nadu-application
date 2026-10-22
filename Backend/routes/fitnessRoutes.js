const express = require('express');
const router = express.Router();
const fitnessController = require('../controllers/fitnessController');

router.get('/', fitnessController.getFitnessData);
router.get('/search-food', fitnessController.searchFood);
router.put('/profile', fitnessController.updateProfile);
router.put('/water', fitnessController.updateWaterIntake);
router.post('/food', fitnessController.addFoodItem);
router.delete('/food/:foodId', fitnessController.deleteFoodItem);

module.exports = router;