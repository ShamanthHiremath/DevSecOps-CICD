const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const path = require('path');
const fileUpload=require("express-fileupload");
const { cloudinaryConnect }=require("./utils/cloudinaryUpload");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

cloudinaryConnect();
app.use(
  fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp",
  })
);

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
