const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin Registration
exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        admin = new Admin({
            email,
            password: hashedPassword
        });
        await admin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Add login time to history
        admin.loginHistory.push({ loginTime: new Date() });
        await admin.save();

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin Logout
exports.logoutAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Update the last login session with logout time
        const lastSession = admin.loginHistory[admin.loginHistory.length - 1];
        lastSession.logoutTime = new Date();
        await admin.save();

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
