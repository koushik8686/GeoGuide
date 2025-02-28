import mongoose from 'mongoose';

const TripSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tripName: { type: String, required: true },
    tripStartTime: { type: Date, required: true },
    StartLocation: { type: String, required: true },
    EndLocation: { type: String, },
    tripEndTime: { type: Date },
    trip_type: { type: String },
    budget: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    spendingByCategory: {
        type: Map,
        of: Number,
        default: {}
    },
    transactions: [{
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Calculate trip progress
TripSchema.methods.calculateProgress = function() {
    if (!this.tripStartTime || !this.tripEndTime) return 0;
    
    const totalDays = (this.tripEndTime - this.tripStartTime) / (1000 * 60 * 60 * 24);
    const elapsedDays = (new Date() - this.tripStartTime) / (1000 * 60 * 60 * 24);
    return Math.min(Math.round((elapsedDays / totalDays) * 100), 100);
};

// Update spending category
TripSchema.methods.updateSpendingCategory = function(category, amount) {
    if (!this.spendingByCategory) {
        this.spendingByCategory = new Map();
    }
    const currentAmount = this.spendingByCategory.get(category) || 0;
    this.spendingByCategory.set(category, currentAmount + amount);
    this.spentAmount += amount;
};

const Trip = mongoose.model('Trips', TripSchema);
export default Trip;