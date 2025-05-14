const express = require('express');
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController');
const { authenticateAdmin } = require('../middleware/auth');

// Create event route
router.post('/create', createEvent);

// Get all events route
router.get('/', getEvents);

module.exports = router; 