const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Admin-only routes
router.post('/create', authenticateAdmin, eventController.createEvent);
router.put('/:id', authenticateAdmin, eventController.updateEvent);
router.delete('/:id', authenticateAdmin, eventController.deleteEvent);

module.exports = router;