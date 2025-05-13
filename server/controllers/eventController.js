const Event = require('../models/Event');
const Booking = require('../models/Booking');

const cloudinary=require('cloudinary').v2;
const { cloudinaryConnect } = require("../utils/cloudinaryUpload");
const {uploadImageToCloudinary}=require("../utils/imageUploader");

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { 
      title, 
      department, 
      description, 
      date, 
      time, 
      location, 
      category, 
      firstPrice, 
      secondPrice, 
      thirdPrice 
    } = req.body;

  
    // Validate required fields
    if (!title || !department || !description || !date || !time || !location || !category || 
        !firstPrice || !secondPrice || !thirdPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const image = req.files?.image;
    let imageUrl = '';

    if(image) {
        try {
            cloudinaryConnect();
            const result = await uploadImageToCloudinary(image, process.env.FOLDER_NAME, 1000, 1000);
            imageUrl = result.secure_url;
        } catch(error) {
            console.error("Error uploading image:", error);
            return res.status(500).json({
                success: false,
                message: "Error uploading image to Cloudinary",
                error: error.message
            });
        }
    }
    

    // Create new event
    const event = new Event({
      title,
      department,
      description,
      date: new Date(date),
      time,
      location,
      category,
      firstPrice: parseFloat(firstPrice),
      secondPrice: parseFloat(secondPrice),
      thirdPrice: parseFloat(thirdPrice),
      image: imageUrl,
      // createdBy: 
    });

    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// Get all events with participantCount
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).lean();
    const eventIds = events.map(e => e._id);
    const counts = await Booking.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: '$event', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[c._id.toString()] = c.count; });
    const eventsWithCount = events.map(e => ({
      ...e,
      participantCount: countMap[e._id.toString()] || 0
    }));
    res.status(200).json(eventsWithCount);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents
}; 