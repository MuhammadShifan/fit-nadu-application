const express = require('express');
const router = express.Router();
const { register, adminLogin, userLogin, savePushToken } = require('../controllers/authController'); 

router.post('/register', register);
router.post('/admin-login', adminLogin);
router.post('/login', userLogin);
router.post('/save-token', savePushToken);

module.exports = router;