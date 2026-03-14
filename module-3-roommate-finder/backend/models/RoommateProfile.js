const mongoose = require('mongoose');

const roommateProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, maxlength: 500 },
  age: { type: Number, required: true },
  occupation: { type: String, enum: ['student', 'working', 'other'], required: true },
  budget: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  preferredLocation: {
    city: { type: String, required: true },
    areas: [String]
  },
  preferences: {
    gender: { type: String, enum: ['male', 'female', 'any'] },
    smoking: { type: String, enum: ['yes', 'no', 'occasionally'] },
    drinking: { type: String, enum: ['yes', 'no', 'occasionally'] },
    pets: { type: String, enum: ['yes', 'no'] },
    foodPreference: { type: String, enum: ['veg', 'non-veg', 'any'] },
    sleepSchedule: { type: String, enum: ['early-bird', 'night-owl', 'flexible'] },
    cleanliness: { type: String, enum: ['very-clean', 'moderate', 'relaxed'] }
  },
  interests: [String],
  lookingFor: { type: String, enum: ['roommate', 'room', 'both'], default: 'both' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RoommateProfile', roommateProfileSchema);
