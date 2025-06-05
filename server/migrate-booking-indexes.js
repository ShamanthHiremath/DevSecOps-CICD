const mongoose = require('mongoose');
require('dotenv').config();

// Migration script to fix USN unique constraint issue
// This allows users to register for multiple events with the same USN
async function migrateBookingIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management');
    console.log('Connected to MongoDB for migration');

    const db = mongoose.connection.db;
    const collection = db.collection('bookings');

    // Get existing indexes
    const indexes = await collection.indexes();
    console.log('Existing indexes:', indexes);

    // Drop the old unique index on USN if it exists
    try {
      await collection.dropIndex('usn_1');
      console.log('Dropped old USN unique index');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('USN unique index not found (already removed or never existed)');
      } else {
        console.log('Error dropping USN index:', error.message);
      }
    }

    // Create the new compound unique index (event + usn)
    try {
      await collection.createIndex({ event: 1, usn: 1 }, { unique: true });
      console.log('Created new compound unique index on event + usn');
    } catch (error) {
      if (error.codeName === 'IndexOptionsConflict') {
        console.log('Compound index already exists');
      } else {
        console.log('Error creating compound index:', error.message);
      }
    }

    // Verify final indexes
    const finalIndexes = await collection.indexes();
    console.log('Final indexes:', finalIndexes);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateBookingIndexes();
}

module.exports = migrateBookingIndexes;