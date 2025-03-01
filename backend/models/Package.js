import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  selectedDate: {
    type: String,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number
  },
  maxCapacity: {
    type: Number,
    required: true
  },
  availableSpots: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
  bookings: [bookingSchema],
  image: {
    type: String,
    required: true,
  },
  agency: {
    type: String,
    required: true,
  },
  agencyLogo: {
    type: String,
    required: true,
  },
  inclusions: [{
    type: String,
  }],
  highlights: [{
    type: String,
  }],
  dates: [{
    date: String,
    availableSpots: Number,
    price: Number
  }],
  accommodation: {
    type: String,
    required: true,
  },
  groupSize: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  meals: {
    type: String,
    required: true,
  },
  transportation: {
    type: String,
    required: true,
  },
  cancellationPolicy: {
    type: String,
    default: "Free cancellation up to 24 hours before the start date"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Calculate average rating before saving
packageSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
  }
  this.updatedAt = Date.now();
  next();
});

const Package = mongoose.model('Package', packageSchema);
export default Package;
