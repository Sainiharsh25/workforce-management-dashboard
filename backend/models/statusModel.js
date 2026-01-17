import mongoose from 'mongoose';

// Define the schema for the status
const statusSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create the model using the schema
const Status = mongoose.model('Status', statusSchema);

export default Status;
