import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  budget: {
    type: Number,
    required: true
  },
  spentAmount: {
    type: Number,
    default: 0
  },
  spendingByCategory: {
    type: Map,
    of: Number,
    default: {}
  },
  visitedPlaces: [{
    name: String,
    location: {
      lat: Number,
      lng: Number
    },
    visitDate: Date
  }],
  plannedPlaces: [{
    name: String,
    location: {
      lat: Number,
      lng: Number
    },
    plannedDate: Date
  }],
  itinerary: [{
    time: String,
    activity: String,
    status: {
      type: String,
      enum: ['completed', 'in_progress', 'upcoming'],
      default: 'upcoming'
    }
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }]
}, {
  timestamps: true
});

// Calculate trip progress
tripSchema.methods.calculateProgress = function() {
  const totalDays = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
  const elapsedDays = (new Date() - this.startDate) / (1000 * 60 * 60 * 24);
  return Math.min(Math.round((elapsedDays / totalDays) * 100), 100);
};

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
