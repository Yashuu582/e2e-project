const axios = require('axios');

const testHostel = {
  name: 'Test Hostel',
  owner: '507f1f77bcf86cd799439011',
  address: {
    street: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  },
  contactNumber: '9876543210',
  email: 'test@hostel.com',
  hostelType: 'boys',
  description: 'Test hostel description',
  facilities: ['WiFi', 'AC'],
  rules: ['No smoking']
};

axios.post('http://localhost:4002/api/hostels', testHostel)
  .then(res => {
    console.log('Success:', res.data);
  })
  .catch(err => {
    console.error('Error:', err.response?.data || err.message);
  });
