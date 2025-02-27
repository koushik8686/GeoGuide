import mongoose from 'mongoose';

// **Transaction Schema**
const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['CREDIT', 'DEBIT', 'UPI'], 
    required: true 
  },
  amount: { type: Number, required: true },
  category: String,
  description: String,
  timestamp: { type: Date, default: Date.now },
  bank: String,
  account: String,
  recipient: String,
  extractionConfidence: Number,
  rawMessage: String
});

export default mongoose.model("Transaction", TransactionSchema);