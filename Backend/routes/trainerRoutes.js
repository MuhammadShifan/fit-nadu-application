const express = require('express');
const router = express.Router();
const multer = require('multer');
const trainerController = require('../controllers/trainerController');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Trainer = require('../models/Trainer');

router.post('/add', upload.array('images', 5), trainerController.addTrainer);
router.get('/admin/all', trainerController.getAllTrainers);
router.get('/details/:id', trainerController.getTrainerById);
router.delete('/delete/:id', trainerController.deleteTrainer);
router.put('/update/:id', upload.array('images', 5), trainerController.updateTrainer);
router.put('/toggle-featured/:id', async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

        trainer.isFeatured = !trainer.isFeatured;
        await trainer.save();
        res.json({ success: true, isFeatured: trainer.isFeatured });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.get('/featured', async (req, res) => {
    try {
        const featuredTrainers = await Trainer.find({ isFeatured: true, status: 'Active' });
        res.json({ success: true, trainers: featuredTrainers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;