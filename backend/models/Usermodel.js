import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  name: String,
  phoneNumber: String,
  profilePicture: String,
  current_trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trips' },
  registrationDate: { type: Date, default: Date.now },
  lastLogin: Date,
  deviceToken: String, // For push notifications
  otp: { type: String },
  otpExpiry: { type: Date },
  followers:[String],
  verified: { type: Boolean, default: false },
  events:[],
  history:[],
  trips:[{type:mongoose.Schema.Types.ObjectId, ref: 'Trips'}],
  friends:[],
  calenderEvents:[],
  transactions:[{
    receiver:String,
    message:String,
    amount: Number,
    category: String,
    bank: String,
    rawMessage: String,
    timestamp:Date,
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number
    }
  }],
  notifications:[{
    sender:String,
    message:String,
    timestamp:Date,
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number
    }
  }]
});

export default mongoose.model("User", UserSchema);