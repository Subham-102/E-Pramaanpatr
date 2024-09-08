const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
