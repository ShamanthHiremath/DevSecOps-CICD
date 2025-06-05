const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  usn: {
    type: String,
    required: true,
    uppercase: true
  },
  year: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound unique index to prevent duplicate USN registration for the same event
// but allow the same USN to register for different events
bookingSchema.index({ event: 1, usn: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);