import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  googleId: String, // Reference to user
  eventId: String,
  summary: String,
  description: String,
  location: String,
  startTime: Date,
  endTime: Date,
});

const Event = mongoose.model("Event", EventSchema);

export default Event;