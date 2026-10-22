const express = require('express');
const router = express.Router();
const supplementController = require('../controllers/supplementController');
const Supplement = require('../models/Supplement'); 
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add', upload.single('image'), supplementController.addSupplement);
router.get('/admin/all', supplementController.getAllSupplements);
router.delete('/delete/:id', supplementController.deleteSupplement);
router.put('/update/:id', upload.single('image'), supplementController.updateSupplement);

router.put('/toggle-featured/:id', async (req, res) => {
    try {
        const supplement = await Supplement.findById(req.params.id);
        if (!supplement) return res.status(404).json({ success: false, message: 'Supplement not found' });

        supplement.isFeatured = !supplement.isFeatured;
        await supplement.save();
        res.json({ success: true, isFeatured: supplement.isFeatured });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/featured', async (req, res) => {
    try {
        const featuredSupplements = await Supplement.find({ isFeatured: true, status: 'Active' });
        res.json({ success: true, supplements: featuredSupplements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;