const express = require('express');
const router = express.Router();
const { addGym, getAllGyms, getActiveGymsForApp, deleteGym, updateGym, getGymById } = require('../controllers/gymController');
// INTHA LINE PUDHUSA ADD PANNIRUKKEN
const Gym = require('../models/Gym'); 

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add', upload.array('images', 10), addGym);
router.get('/admin/all', getAllGyms);
router.get('/app/active', getActiveGymsForApp);
router.get('/details/:id', getGymById);
router.delete('/delete/:id', deleteGym);
router.put('/update/:id', upload.array('images', 10), updateGym);

router.put('/toggle-featured/:id', async (req, res) => {
    try {
        const gym = await Gym.findById(req.params.id);
        if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });
        
        gym.isFeatured = !gym.isFeatured;
        await gym.save();
        res.json({ success: true, isFeatured: gym.isFeatured });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/featured', async (req, res) => {
    try {
        const featuredGyms = await Gym.find({ isFeatured: true, status: 'Active' });
        res.json({ success: true, gyms: featuredGyms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;