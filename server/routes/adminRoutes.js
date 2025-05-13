const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');
// Admin login route
router.post('/login', adminController.adminLogin);

// Admin signup
router.post('/signup', adminController.adminSignup);

// Register for an event (public route)
router.post('/register-event', adminController.registerForEvent);

// Get event participants (protected route)
router.get('/event-participants/:eventId', authenticateAdmin, adminController.getEventParticipants);

module.exports = router; 