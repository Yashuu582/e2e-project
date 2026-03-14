const express = require('express');
const axios = require('axios');
const session = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'hostel_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static('public'));

const API_URL = 'http://localhost:4002/api';

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('http://localhost:8081/login');
});

// Home - List all hostels
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/hostels`);
    res.render('index', { hostels: response.data.hostels || [], error: null });
  } catch (error) {
    console.error('Fetch error:', error.response?.data || error.message);
    res.render('index', { hostels: [], error: 'Failed to load hostels' });
  }
});

// Search hostels
app.get('/search', async (req, res) => {
  try {
    const { city, hostelType, search } = req.query;
    const response = await axios.get(`${API_URL}/hostels`, { 
      params: { city, hostelType, search }
    });
    res.render('index', { hostels: response.data.hostels || [], error: null });
  } catch (error) {
    console.error('Search error:', error.response?.data || error.message);
    res.render('index', { hostels: [], error: 'Search failed' });
  }
});

// View hostel details
app.get('/hostel/:id', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/hostels/${req.params.id}`);
    res.render('details', { hostel: response.data.hostel, error: null });
  } catch (error) {
    console.error('Details error:', error.response?.data || error.message);
    res.render('details', { hostel: null, error: 'Hostel not found' });
  }
});

// Add hostel form
app.get('/add', (req, res) => {
  res.render('add', { error: null });
});

// Add hostel submit
app.post('/add', async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      owner: '507f1f77bcf86cd799439011',
      address: {
        street: req.body.street || '',
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode || ''
      },
      contactNumber: req.body.contactNumber,
      email: req.body.email || '',
      hostelType: req.body.hostelType,
      description: req.body.description || '',
      facilities: req.body.facilities ? req.body.facilities.split(',').map(f => f.trim()) : [],
      rules: req.body.rules ? req.body.rules.split(',').map(r => r.trim()) : []
    };
    
    if (!data.address.city || !data.address.state) {
      return res.render('add', { error: 'City and State are required' });
    }
    
    await axios.post(`${API_URL}/hostels`, data, {
      headers: { Authorization: 'Bearer dummy-token' }
    });
    res.redirect('/');
  } catch (error) {
    res.render('add', { error: error.response?.data?.message || 'Failed to add hostel' });
  }
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Module 2 Frontend on http://localhost:${PORT}`));
