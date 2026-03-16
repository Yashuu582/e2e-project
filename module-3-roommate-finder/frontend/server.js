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
  secret: 'roommate_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static('public'));

const API_URL = process.env.ROOMMATE_BACKEND_URL || 'http://localhost:4003/api';

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect((process.env.AUTH_FRONTEND_URL || 'http://localhost:8081') + '/login');
});

// Home
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

// Create Profile
app.get('/profile/create', (req, res) => {
  res.render('create-profile', { error: null });
});

app.post('/profile/create', async (req, res) => {
  try {
    console.log('Raw form data:', req.body);
    
    const timestamp = Date.now().toString(16);
    const random = Math.random().toString(16).substring(2, 10);
    const uniqueId = (timestamp + random).padEnd(24, '0').substring(0, 24);
    
    const data = {
      user: uniqueId,
      bio: req.body.bio,
      age: req.body.age,
      occupation: req.body.occupation,
      budget: {
        min: req.body.budgetMin,
        max: req.body.budgetMax
      },
      preferredLocation: {
        city: req.body.city,
        areas: req.body.areas ? req.body.areas.split(',').map(a => a.trim()) : []
      },
      preferences: {
        gender: req.body.gender,
        smoking: req.body.smoking,
        drinking: req.body.drinking,
        pets: req.body.pets,
        foodPreference: req.body.foodPreference,
        sleepSchedule: req.body.sleepSchedule,
        cleanliness: req.body.cleanliness
      },
      interests: req.body.interests ? req.body.interests.split(',').map(i => i.trim()) : [],
      lookingFor: req.body.lookingFor
    };
    
    console.log('Sending to backend:', JSON.stringify(data, null, 2));
    const response = await axios.post(`${API_URL}/roommates/profile`, data);
    console.log('Backend response:', response.data);
    req.session.userId = uniqueId;
    res.redirect('/matches');
  } catch (error) {
    console.error('Profile creation error:', error.response?.data || error.message);
    res.render('create-profile', { error: error.response?.data?.message || 'Failed to create profile' });
  }
});

// Find Matches
app.get('/matches', async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/roommates/matches`, { userId: req.session.userId });
    res.render('matches', { matches: response.data.matches || [], error: null });
  } catch (error) {
    console.error('Matches error:', error.response?.data || error.message);
    res.render('matches', { matches: [], error: null });
  }
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => console.log(`Module 3 Frontend on http://localhost:${PORT}`));
