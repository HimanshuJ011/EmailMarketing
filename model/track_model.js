import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the tracking schema
const trackSchema = new Schema({
  trackingId: {
    type: String,
    required: true,
    index: true, // Index for faster lookups
  },
  opens: {
    type: Number,
    default: 0,
  },
  userIPs: {
    type: [String], // Array of strings to store multiple IPs
    default: [],    // Default to an empty array
  },
}, { timestamps: true }); // Automatically add `createdAt` and `updatedAt` fields

// Create and export the model
const Tracking = mongoose.model('Tracking', trackSchema);

export default Tracking;
