require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// ── Setup ─────────────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Database ──────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => { console.error(err); process.exit(1); });

// ── Models ────────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  userType: { type: String, enum: ['seeker', 'provider', 'admin'], default: 'seeker' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function (p) { return bcrypt.compare(p, this.password); };
const User = mongoose.model('User', userSchema);

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: { street: String, city: { type: String, required: true }, state: { type: String, required: true }, pincode: String },
  contactNumber: { type: String, required: true },
  email: String,
  hostelType: { type: String, enum: ['boys', 'girls', 'co-ed'], required: true },
  facilities: [String],
  description: String,
  rules: [String],
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number, comment: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
});
const Hostel = mongoose.model('Hostel', hostelSchema);

const roommateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: String,
  age: { type: Number, required: true },
  occupation: { type: String, enum: ['student', 'working', 'other'], required: true },
  budget: { min: { type: Number, required: true }, max: { type: Number, required: true } },
  preferredLocation: { city: { type: String, required: true }, areas: [String] },
  preferences: {
    gender: { type: String, enum: ['male', 'female', 'any'] },
    smoking: { type: String, enum: ['yes', 'no', 'occasionally'] },
    foodPreference: { type: String, enum: ['veg', 'non-veg', 'any'] },
    sleepSchedule: { type: String, enum: ['early-bird', 'night-owl', 'flexible'] },
    cleanliness: { type: String, enum: ['very-clean', 'moderate', 'relaxed'] }
  },
  interests: [String],
  lookingFor: { type: String, enum: ['roommate', 'room', 'both'], default: 'both' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const RoommateProfile = mongoose.model('RoommateProfile', roommateSchema);

// ── Helpers ───────────────────────────────────────────────────────────────────
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
const requireAdmin = (req, res, next) => {
  if (req.session.user?.role === 'admin') return next();
  res.status(403).send('<h1>Access Denied</h1><a href="/login/admin">Admin Login</a>');
};

// ══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.get('/', (req, res) => res.render('home', { user: req.session.user }));

app.get('/register', (req, res) => res.render('register', { error: null }));
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, gender, userType } = req.body;
    if (password !== confirmPassword) return res.render('register', { error: 'Passwords do not match' });
    if (await User.findOne({ email })) return res.render('register', { error: 'Email already registered' });
    const user = await User.create({ name, email, password, phone, gender, userType, role: userType === 'admin' ? 'admin' : 'user' });
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType };
    res.redirect(user.role === 'admin' ? '/admin' : user.userType === 'provider' ? '/hostels' : '/roommates');
  } catch (e) { res.render('register', { error: e.message }); }
});

app.get('/login', (req, res) => res.redirect('/login/seeker'));
app.get('/login/seeker', (req, res) => res.render('login', { type: 'seeker', error: null }));
app.get('/login/provider', (req, res) => res.render('login', { type: 'provider', error: null }));
app.get('/login/admin', (req, res) => res.render('login', { type: 'admin', error: null }));

app.post('/login/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password)))
      return res.render('login', { type, error: 'Invalid credentials' });
    if (user.userType !== type)
      return res.render('login', { type, error: `This login is for ${type}s only` });
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType };
    res.redirect(type === 'admin' ? '/admin' : type === 'provider' ? '/hostels' : '/roommates');
  } catch (e) { res.render('login', { type, error: e.message }); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });

// ══════════════════════════════════════════════════════════════════════════════
// HOSTEL ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.get('/hostels', async (req, res) => {
  try {
    const { city, hostelType, search } = req.query;
    const query = {};
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (hostelType) query.hostelType = hostelType;
    if (search) query.name = new RegExp(search, 'i');
    const hostels = await Hostel.find(query);
    res.render('hostels/index', { hostels, error: null, user: req.session.user, query: req.query });
  } catch (e) { res.render('hostels/index', { hostels: [], error: e.message, user: req.session.user, query: {} }); }
});

app.get('/hostels/add', (req, res) => res.render('hostels/add', { error: null, user: req.session.user }));
app.post('/hostels/add', async (req, res) => {
  try {
    await Hostel.create({
      name: req.body.name, owner: req.session.user?.id,
      address: { street: req.body.street, city: req.body.city, state: req.body.state, pincode: req.body.pincode },
      contactNumber: req.body.contactNumber, email: req.body.email,
      hostelType: req.body.hostelType, description: req.body.description,
      facilities: req.body.facilities ? req.body.facilities.split(',').map(f => f.trim()) : [],
      rules: req.body.rules ? req.body.rules.split(',').map(r => r.trim()) : []
    });
    res.redirect('/hostels');
  } catch (e) { res.render('hostels/add', { error: e.message, user: req.session.user }); }
});

app.get('/hostels/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.redirect('/hostels');
    res.render('hostels/details', { hostel, user: req.session.user });
  } catch { res.redirect('/hostels'); }
});

// ══════════════════════════════════════════════════════════════════════════════
// ROOMMATE ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.get('/roommates', (req, res) => res.render('roommates/index', { user: req.session.user }));

app.get('/roommates/create', (req, res) => res.render('roommates/create', { error: null, user: req.session.user }));
app.post('/roommates/create', async (req, res) => {
  try {
    const userId = req.session.user?.id || new mongoose.Types.ObjectId();
    await RoommateProfile.create({
      user: userId, bio: req.body.bio, age: req.body.age, occupation: req.body.occupation,
      budget: { min: req.body.budgetMin, max: req.body.budgetMax },
      preferredLocation: { city: req.body.city, areas: req.body.areas ? req.body.areas.split(',').map(a => a.trim()) : [] },
      preferences: {
        gender: req.body.gender, smoking: req.body.smoking,
        foodPreference: req.body.foodPreference, sleepSchedule: req.body.sleepSchedule, cleanliness: req.body.cleanliness
      },
      interests: req.body.interests ? req.body.interests.split(',').map(i => i.trim()) : [],
      lookingFor: req.body.lookingFor
    });
    req.session.roommateUserId = userId.toString();
    res.redirect('/roommates/matches');
  } catch (e) { res.render('roommates/create', { error: e.message, user: req.session.user }); }
});

app.get('/roommates/matches', async (req, res) => {
  try {
    const myProfile = await RoommateProfile.findOne({ user: req.session.roommateUserId || req.session.user?.id });
    if (!myProfile) return res.render('roommates/matches', { matches: [], user: req.session.user });
    const matches = await RoommateProfile.find({
      isActive: true, _id: { $ne: myProfile._id },
      'preferredLocation.city': myProfile.preferredLocation.city,
      'budget.min': { $lte: myProfile.budget.max },
      'budget.max': { $gte: myProfile.budget.min }
    });
    const scored = matches
      .map(m => ({ ...m.toObject(), score: Math.floor(Math.random() * 40) + 60 }))
      .sort((a, b) => b.score - a.score);
    res.render('roommates/matches', { matches: scored, user: req.session.user });
  } catch { res.render('roommates/matches', { matches: [], user: req.session.user }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.get('/admin', requireAdmin, async (req, res) => {
  const [totalUsers, verifiedUsers, totalHostels, verifiedHostels, pendingHostels] = await Promise.all([
    User.countDocuments(), User.countDocuments({ isVerified: true }),
    Hostel.countDocuments(), Hostel.countDocuments({ isVerified: true }), Hostel.countDocuments({ isVerified: false })
  ]);
  res.render('admin/dashboard', { stats: { totalUsers, verifiedUsers, totalHostels, verifiedHostels, pendingHostels }, user: req.session.user });
});

app.get('/admin/hostels', requireAdmin, async (req, res) => {
  const hostels = await Hostel.find({ isVerified: false }).populate('owner', 'name email').sort('-createdAt');
  res.render('admin/hostels', { hostels, user: req.session.user });
});

app.post('/admin/hostels/:id/verify', requireAdmin, async (req, res) => {
  await Hostel.findByIdAndUpdate(req.params.id, { isVerified: true });
  res.redirect('/admin/hostels');
});

app.post('/admin/hostels/:id/reject', requireAdmin, async (req, res) => {
  await Hostel.findByIdAndDelete(req.params.id);
  res.redirect('/admin/hostels');
});

app.get('/admin/users', requireAdmin, async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.render('admin/users', { users, user: req.session.user });
});

app.post('/admin/users/:id/verify', requireAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isVerified: true });
  res.redirect('/admin/users');
});

app.post('/admin/users/:id/delete', requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/admin/users');
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FindMyStay running on http://localhost:${PORT}`));
