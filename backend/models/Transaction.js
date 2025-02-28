import mongoose from 'mongoose';

// **Transaction Schema**
const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  type: {
    type: String,
    enum: ['CREDIT', 'DEBIT', 'UPI'], 
    required: true 
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: [
      'food_and_dining',
      'transportation',
      'accommodation',
      'shopping',
      'entertainment',
      'sightseeing',
      'other'
    ],
    default: 'other'
  },
  description: String,
  bank: String,
  account: String,
  recipient: String,
  extractionConfidence: Number,
  rawMessage: String,
  location: {
    lat: Number,
    lng: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model("Transaction", TransactionSchema);