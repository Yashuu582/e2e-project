const axios = require('axios');

const testProfile = {
  user: '507f1f77bcf86cd799439011',
  bio: 'Looking for a roommate',
  age: 25,
  occupation: 'working',
  budget: {
    min: 5000,
    max: 10000
  },
  preferredLocation: {
    city: 'Mumbai',
    areas: ['Andheri', 'Bandra']
  },
  preferences: {
    gender: 'any',
    smoking: 'no',
    drinking: 'occasionally',
    pets: 'no',
    foodPreference: 'veg',
    sleepSchedule: 'flexible',
    cleanliness: 'moderate'
  },
  interests: ['Reading', 'Movies'],
  lookingFor: 'both',
  isActive: true
};

axios.post('http://localhost:4003/api/roommates/profile', testProfile)
  .then(res => {
    console.log('Success:', res.data);
  })
  .catch(err => {
    console.error('Error:', err.response?.data || err.message);
  });
