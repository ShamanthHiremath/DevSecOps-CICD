const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  firstPrice: {
    type: Number,
    required: true
  },
  secondPrice: {
    type: Number,
    required: true
  },
  thirdPrice: {
    type: Number,
    required: true
  },
  eligibility: {
    type: [String], // Array of strings for multiple years
    required: true,
    validate: {
      validator: function(years) {
        return years.length > 0 && years.every(year => ['1', '2', '3', '4'].includes(year));
      },
      message: 'Eligibility must contain at least one valid year (1, 2, 3, or 4)'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);