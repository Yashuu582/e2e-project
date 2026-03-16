const express = require('express');
const axios = require('axios');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'findmystay_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static('public'));

const API_URL = process.env.AUTH_BACKEND_URL || 'https://module-1-production-8615.up.railway.app/api';

// Home
app.get('/', (req, res) => {
  res.render('home', { user: req.session.user });
});

// Register Page
app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Register Submit
app.post('/register', async (req, res) => {
  try {
    console.log('Sending to backend:', req.body);
    const response = await axios.post(`${API_URL}/auth/register`, req.body);
    console.log('Backend response:', response.data);
    req.session.token = response.data.token;
    req.session.user = response.data.user;
    res.redirect(`/login/${response.data.user.userType}?registered=true`);
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    res.render('register', { error: error.response?.data?.message || 'Registration failed' });
  }
});

// Login Pages
app.get('/login/seeker', (req, res) => {
  res.render('login-seeker', { error: null, success: null });
});

app.get('/login/provider', (req, res) => {
  res.render('login-provider', { error: null, success: null });
});

app.get('/login/admin', (req, res) => {
  res.render('login-admin', { error: null, success: null });
});

// Login Page (redirect to seeker)
app.get('/login', (req, res) => {
  res.redirect('/login/seeker');
});

// Login Submit - Seeker
app.post('/login/seeker', async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, req.body);
    if (response.data.user.userType !== 'seeker') {
      return res.render('login-seeker', { error: 'Invalid user type. Please use correct login.', success: null });
    }
    req.session.token = response.data.token;
    req.session.user = response.data.user;
    res.redirect(process.env.ROOMMATE_FRONTEND_URL || 'http://localhost:8083');
  } catch (error) {
    res.render('login-seeker', { error: error.response?.data?.message || 'Login failed', success: null });
  }
});

// Login Submit - Provider
app.post('/login/provider', async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, req.body);
    if (response.data.user.userType !== 'provider') {
      return res.render('login-provider', { error: 'Invalid user type. Please use correct login.', success: null });
    }
    req.session.token = response.data.token;
    req.session.user = response.data.user;
    res.redirect(process.env.HOSTEL_FRONTEND_URL || 'http://localhost:8082');
  } catch (error) {
    res.render('login-provider', { error: error.response?.data?.message || 'Login failed', success: null });
  }
});

// Login Submit - Admin
app.post('/login/admin', async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, req.body);
    if (response.data.user.userType !== 'admin') {
      return res.render('login-admin', { error: 'Access Denied. Admin only.', success: null });
    }
    req.session.token = response.data.token;
    req.session.user = response.data.user;
    res.redirect(process.env.ADMIN_FRONTEND_URL || 'http://localhost:8084');
  } catch (error) {
    res.render('login-admin', { error: error.response?.data?.message || 'Login failed', success: null });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Frontend running on http://localhost:${PORT}`));
