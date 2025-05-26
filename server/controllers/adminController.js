const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and is admin
    const admin = await User.findOne({ email});
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id},
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, usn, year, semester, branch, name } = req.body;


    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if USN is already registered for this event
    const existingBooking = await Booking.findOne({ event: eventId, usn: usn.toUpperCase() });
    if (existingBooking) {
      return res.status(400).json({ message: 'This USN is already registered for this event' });
    }

    // Create booking
    const booking = new Booking({
      event: eventId,
      usn: usn.toUpperCase(),
      year,
      semester,
      branch,
      name
    });

    await booking.save();

    res.status(201).json({
      message: 'Successfully registered for event',
      booking
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This USN is already registered for an event' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all event participants
exports.getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get all bookings for the event
    const participants = await Booking.find({ event: eventId })
      .select('usn year semester branch tickets createdAt name');

    res.status(200).json({
      event: {
        title: event.title,
        date: event.date,
        totalParticipants: participants.length
      },
      participants
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Signup
exports.adminSignup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'email already exists' });
    }
    const admin = new User({ email, password, name });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add this new method to your adminController
const getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Find all bookings for this event and populate with user details
    const bookings = await Booking.find({ event: eventId })
      .populate('user', 'name email phone college department year')
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching event participants:', error);
    res.status(500).json({ 
      message: 'Error fetching participants', 
      error: error.message 
    });
  }
};

// Export this new method along with your existing ones
// module.exports = {
//   adminLogin,
//   registerForEvent,
//   getEventParticipants,
//   adminSignup
// };