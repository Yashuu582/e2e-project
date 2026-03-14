const axios = require('axios');

console.log('Testing APIs...\n');

// Test Hostel API
axios.get('http://localhost:4002/api/hostels')
  .then(res => {
    console.log('✓ Hostel API working');
    console.log('  Hostels count:', res.data.count);
  })
  .catch(err => console.error('✗ Hostel API error:', err.message));

// Test Roommate API
axios.get('http://localhost:4003/api/roommates/matches')
  .then(res => {
    console.log('✓ Roommate API working');
    console.log('  Profiles count:', res.data.matches?.length || 0);
  })
  .catch(err => console.error('✗ Roommate API error:', err.message));

// Test adding hostel
setTimeout(() => {
  const hostel = {
    name: 'Test Hostel',
    owner: '507f1f77bcf86cd799439011',
    address: { city: 'Mumbai', state: 'Maharashtra' },
    contactNumber: '9876543210',
    hostelType: 'boys'
  };
  
  axios.post('http://localhost:4002/api/hostels', hostel)
    .then(res => console.log('\n✓ Hostel created:', res.data.hostel.name))
    .catch(err => console.error('\n✗ Hostel creation error:', err.response?.data?.message || err.message));
}, 1000);

// Test adding roommate profile
setTimeout(() => {
  const profile = {
    user: '507f1f77bcf86cd799439012',
    age: 25,
    occupation: 'working',
    budget: { min: 5000, max: 10000 },
    preferredLocation: { city: 'Mumbai' },
    preferences: { gender: 'any', smoking: 'no', foodPreference: 'veg', sleepSchedule: 'flexible', cleanliness: 'moderate' }
  };
  
  axios.post('http://localhost:4003/api/roommates/profile', profile)
    .then(res => console.log('✓ Roommate profile created'))
    .catch(err => console.error('✗ Roommate creation error:', err.response?.data?.message || err.message));
}, 2000);
