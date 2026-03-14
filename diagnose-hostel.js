const axios = require('axios');
const mongoose = require('mongoose');

console.log('=== HOSTEL MANAGEMENT DIAGNOSTIC ===\n');

// Step 1: Check MongoDB Connection
console.log('1. Testing MongoDB Connection...');
mongoose.connect('mongodb://localhost:27017/findmystay')
  .then(() => {
    console.log('   ✓ MongoDB Connected\n');
    
    // Step 2: Check if backend is running
    console.log('2. Testing Backend API...');
    return axios.get('http://localhost:4002/health');
  })
  .then(res => {
    console.log('   ✓ Backend is running:', res.data.module);
    console.log('');
    
    // Step 3: Test GET hostels
    console.log('3. Testing GET /api/hostels...');
    return axios.get('http://localhost:4002/api/hostels');
  })
  .then(res => {
    console.log('   ✓ GET working');
    console.log('   Current hostels:', res.data.count);
    console.log('');
    
    // Step 4: Test POST hostel
    console.log('4. Testing POST /api/hostels...');
    const testHostel = {
      name: 'Diagnostic Test Hostel',
      owner: '507f1f77bcf86cd799439011',
      address: {
        street: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      contactNumber: '9876543210',
      email: 'test@hostel.com',
      hostelType: 'boys',
      description: 'Test hostel for diagnostic',
      facilities: ['WiFi', 'AC'],
      rules: ['No smoking']
    };
    
    return axios.post('http://localhost:4002/api/hostels', testHostel);
  })
  .then(res => {
    console.log('   ✓ POST working');
    console.log('   Created hostel:', res.data.hostel.name);
    console.log('   Hostel ID:', res.data.hostel._id);
    console.log('');
    
    // Step 5: Verify in database
    console.log('5. Verifying in MongoDB...');
    const Hostel = mongoose.model('Hostel', new mongoose.Schema({}, { strict: false }));
    return Hostel.countDocuments();
  })
  .then(count => {
    console.log('   ✓ Database verification');
    console.log('   Total hostels in DB:', count);
    console.log('');
    
    console.log('=== ALL TESTS PASSED ===');
    console.log('\nYour hostel management system is working correctly!');
    console.log('If you still cannot add hostels from the frontend:');
    console.log('1. Make sure you fill ALL required fields (Name, Type, Contact, City, State)');
    console.log('2. Check frontend terminal for error messages');
    console.log('3. Check backend terminal for incoming requests');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('\n✗ ERROR FOUND:');
    console.error('   Message:', err.message);
    if (err.response) {
      console.error('   Status:', err.response.status);
      console.error('   Data:', err.response.data);
    }
    console.error('\nFIX:');
    if (err.message.includes('ECONNREFUSED')) {
      console.error('   - Start MongoDB: net start MongoDB');
      console.error('   - Start Backend: cd module-2-hostel-management/backend && node server.js');
    } else if (err.message.includes('connect')) {
      console.error('   - Check if MongoDB is running');
    } else {
      console.error('   - Check the error message above');
    }
    process.exit(1);
  });
