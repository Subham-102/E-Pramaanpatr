const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, logoutAdmin } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin registration
router.post('/register', registerAdmin);

// Admin login
router.post('/login', loginAdmin);

// Admin logout (protected route)
router.post('/logout', authMiddleware, logoutAdmin);

module.exports = router;
