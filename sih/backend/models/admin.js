const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    loginHistory: [
        {
            loginTime: {
                type: Date,
                default: Date.now
            },
            logoutTime: {
                type: Date
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
