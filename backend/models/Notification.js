import mongoose from 'mongoose';

// **Notification Schema**
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    required: true 
  },
  title: String,
  body: String,
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  metadata: mongoose.Schema.Types.Mixed
});

export default mongoose.model("Notification", NotificationSchema);