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
  secret: 'admin_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static('public'));

const API_URL = process.env.ADMIN_BACKEND_URL || 'http://localhost:4004/api';

// Middleware to check admin access
const checkAdmin = (req, res, next) => {
  const userRole = req.session.userRole || 'admin';
  if (userRole !== 'admin') {
    return res.status(403).send('<h1>Access Denied</h1><p>Admin access only. <a href="' + (process.env.AUTH_FRONTEND_URL || 'http://localhost:8081') + '">Go to Login</a></p>');
  }
  next();
};

// Dashboard
app.get('/', checkAdmin, async (req, res) => {
  try {
    console.log('Fetching stats from:', `${API_URL}/admin/stats`);
    const response = await axios.get(`${API_URL}/admin/stats`);
    console.log('Stats response:', response.data);
    res.render('dashboard', { stats: response.data.stats, error: null });
  } catch (error) {
    console.error('Stats error:', error.response?.data || error.message);
    // Show default stats if API fails
    const defaultStats = {
      totalUsers: 0,
      verifiedUsers: 0,
      totalHostels: 0,
      verifiedHostels: 0,
      pendingHostels: 0
    };
    res.render('dashboard', { stats: defaultStats, error: 'Failed to load stats from API' });
  }
});

// Pending Hostels
app.get('/hostels/pending', checkAdmin, async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/admin/hostels/pending`);
    res.render('pending-hostels', { hostels: response.data.hostels || [], error: null });
  } catch (error) {
    res.render('pending-hostels', { hostels: [], error: 'Failed to load hostels' });
  }
});

// Verify Hostel
app.post('/hostels/:id/verify', checkAdmin, async (req, res) => {
  try {
    await axios.put(`${API_URL}/admin/hostels/${req.params.id}/verify`);
    res.redirect('/hostels/pending');
  } catch (error) {
    res.redirect('/hostels/pending');
  }
});

// Reject Hostel
app.post('/hostels/:id/reject', checkAdmin, async (req, res) => {
  try {
    await axios.delete(`${API_URL}/admin/hostels/${req.params.id}/reject`);
    res.redirect('/hostels/pending');
  } catch (error) {
    res.redirect('/hostels/pending');
  }
});

// All Users
app.get('/users', checkAdmin, async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`);
    res.render('users', { users: response.data.users || [], error: null });
  } catch (error) {
    res.render('users', { users: [], error: 'Failed to load users' });
  }
});

// Verify User
app.post('/users/:id/verify', checkAdmin, async (req, res) => {
  try {
    await axios.put(`${API_URL}/admin/users/${req.params.id}/verify`);
    res.redirect('/users');
  } catch (error) {
    res.redirect('/users');
  }
});

// Delete User
app.post('/users/:id/delete', checkAdmin, async (req, res) => {
  try {
    await axios.delete(`${API_URL}/admin/users/${req.params.id}`);
    res.redirect('/users');
  } catch (error) {
    res.redirect('/users');
  }
});

const PORT = process.env.PORT || 8084;
app.listen(PORT, () => console.log(`Module 4 Frontend on http://localhost:${PORT}`));
