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
  distance_travelled: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: { type: String, default: 0 },
  otpExpiry: { type: Date },
  followers:[String],
  verified: { type: Boolean, default: false },
  events:[],
  history:[{
    tag:{type:String , required:true},
    count:{type:Number , default:1},
  }],
  trips:[{type:mongoose.Schema.Types.ObjectId, ref: 'Trips'}],
  // friends:[],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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