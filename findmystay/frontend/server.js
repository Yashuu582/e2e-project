const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET || 'findmystay_secret', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Database ──────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => { console.error(err); process.exit(1); });

// ── Models ────────────────────────────────────────────────────────────────────
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  userType: { type: String, enum: ['seeker', 'provider', 'admin'], default: 'seeker' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  profilePicture: String,
  createdAt: { type: Date, default: Date.now }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = async function(p) { return bcrypt.compare(p, this.password); };
const User = mongoose.model('User', userSchema);

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: { street: String, city: { type: String, required: true }, state: { type: String, required: true }, pincode: String },
  contactNumber: { type: String, required: true },
  email: String,
  hostelType: { type: String, enum: ['boys', 'girls', 'co-ed'], required: true },
  facilities: [String],
  roomTypes: [{ type: String, capacity: Number, pricePerMonth: Number, available: Number }],
  photos: [String],
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
  bio: { type: String, maxlength: 500 },
  age: { type: Number, required: true },
  occupation: { type: String, enum: ['student', 'working', 'other'], required: true },
  budget: { min: { type: Number, required: true }, max: { type: Number, required: true } },
  preferredLocation: { city: { type: String, required: true }, areas: [String] },
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
const RoommateProfile = mongoose.model('RoommateProfile', roommateSchema);

// ── Auth Helpers ──────────────────────────────────────────────────────────────
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const requireAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.session.user?.role === 'admin') return next();
  res.status(403).send('<h1>Access Denied</h1><p><a href="/login/admin">Admin Login</a></p>');
};

// ── API Routes ────────────────────────────────────────────────────────────────

// Auth API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, gender, userType } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });
    const role = userType === 'admin' ? 'admin' : 'user';
    const user = await User.create({ name, email, password, phone, gender, userType, role });
    res.status(201).json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Hostels API
app.get('/api/hostels', async (req, res) => {
  try {
    const { city, hostelType, search } = req.query;
    let query = {};
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (hostelType) query.hostelType = hostelType;
    if (search) query.name = new RegExp(search, 'i');
    const hostels = await Hostel.find(query);
    res.json({ success: true, hostels });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/hostels', async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);
    res.status(201).json({ success: true, hostel });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/hostels/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    res.json({ success: true, hostel });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Roommates API
app.post('/api/roommates/profile', async (req, res) => {
  try {
    const profile = await RoommateProfile.create(req.body);
    res.status(201).json({ success: true, profile });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/roommates/matches', async (req, res) => {
  try {
    const myProfile = await RoommateProfile.findOne({ user: req.body.userId });
    if (!myProfile) return res.status(404).json({ message: 'Create your profile first' });
    const matches = await RoommateProfile.find({
      isActive: true, _id: { $ne: myProfile._id },
      'preferredLocation.city': myProfile.preferredLocation.city,
      'budget.min': { $lte: myProfile.budget.max },
      'budget.max': { $gte: myProfile.budget.min }
    });
    const scoredMatches = matches
      .map(m => ({ ...m.toObject(), compatibilityScore: Math.floor(Math.random() * 40) + 60 }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    res.json({ success: true, matches: scoredMatches });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin API
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [totalUsers, verifiedUsers, totalHostels, verifiedHostels, pendingHostels] = await Promise.all([
      User.countDocuments(), User.countDocuments({ isVerified: true }),
      Hostel.countDocuments(), Hostel.countDocuments({ isVerified: true }), Hostel.countDocuments({ isVerified: false })
    ]);
    res.json({ success: true, stats: { totalUsers, verifiedUsers, totalHostels, verifiedHostels, pendingHostels } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/admin/hostels/pending', async (req, res) => {
  try {
    const hostels = await Hostel.find({ isVerified: false }).populate('owner', 'name email phone').sort('-createdAt');
    res.json({ success: true, hostels });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/admin/hostels/:id/verify', async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    res.json({ success: true, hostel });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/admin/hostels/:id/reject', async (req, res) => {
  try {
    await Hostel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Hostel rejected' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, users });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/admin/users/:id/verify', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── Page Routes ───────────────────────────────────────────────────────────────

// Home
app.get('/', (req, res) => res.render('home', { user: req.session.user }));

// Register
app.get('/register', (req, res) => res.render('register', { error: null }));
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, gender, userType } = req.body;
    if (password !== confirmPassword) return res.render('register', { error: 'Passwords do not match' });
    if (await User.findOne({ email })) return res.render('register', { error: 'User already exists' });
    const role = userType === 'admin' ? 'admin' : 'user';
    const user = await User.create({ name, email, password, phone, gender, userType, role });
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType };
    req.session.token = generateToken(user._id);
    res.redirect(userType === 'admin' ? '/admin' : userType === 'provider' ? '/hostels' : '/roommates');
  } catch (e) { res.render('register', { error: e.message }); }
});

// Login
app.get('/login', (req, res) => res.redirect('/login/seeker'));
app.get('/login/seeker', (req, res) => res.render('login-seeker', { error: null, success: req.query.registered ? 'Registered! Please login.' : null }));
app.get('/login/provider', (req, res) => res.render('login-provider', { error: null, success: req.query.registered ? 'Registered! Please login.' : null }));
app.get('/login/admin', (req, res) => res.render('login-admin', { error: null, success: null }));

app.post('/login/seeker', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) return res.render('login-seeker', { error: 'Invalid credentials', success: null });
    if (user.userType !== 'seeker') return res.render('login-seeker', { error: 'Invalid user type', success: null });
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType };
    req.session.token = generateToken(user._id);
    res.redirect('/roommates');
  } catch (e) { res.render('login-seeker', { error: e.message, success: null }); }
});

app.post('/login/provider', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) return res.render('login-provider', { error: 'Invalid credentials', success: null });
    if (user.userType !== 'provider') return res.render('login-provider', { error: 'Invalid user type', success: null });
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType };
    req.session.token = generateToken(user._id);
    res.redirect('/hostels');
  } catch (e) { res.render('login-provider', { error: e.message, success: null }); }
});

app.post('/login/admin', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) return res.render('login-admin', { error: 'Invalid credentials', success: null });
    if (user.userType !== 'admin') return res.render('login-admin', { error: 'Access Denied. Admin only.', success: null });
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType };
    req.session.token = generateToken(user._id);
    res.redirect('/admin');
  } catch (e) { res.render('login-admin', { error: e.message, success: null }); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

// Hostels Pages
app.get('/hostels', async (req, res) => {
  try {
    const { city, hostelType, search } = req.query;
    let query = {};
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (hostelType) query.hostelType = hostelType;
    if (search) query.name = new RegExp(search, 'i');
    const hostels = await Hostel.find(query);
    res.render('hostels/index', { hostels, error: null, user: req.session.user });
  } catch { res.render('hostels/index', { hostels: [], error: 'Failed to load hostels', user: req.session.user }); }
});

app.get('/hostels/add', (req, res) => res.render('hostels/add', { error: null, user: req.session.user }));

app.post('/hostels/add', async (req, res) => {
  try {
    await Hostel.create({
      name: req.body.name,
      owner: req.session.user?.id,
      address: { street: req.body.street || '', city: req.body.city, state: req.body.state, pincode: req.body.pincode || '' },
      contactNumber: req.body.contactNumber,
      email: req.body.email || '',
      hostelType: req.body.hostelType,
      description: req.body.description || '',
      facilities: req.body.facilities ? req.body.facilities.split(',').map(f => f.trim()) : [],
      rules: req.body.rules ? req.body.rules.split(',').map(r => r.trim()) : []
    });
    res.redirect('/hostels');
  } catch (e) { res.render('hostels/add', { error: e.message, user: req.session.user }); }
});

app.get('/hostels/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.render('hostels/details', { hostel: null, error: 'Hostel not found', user: req.session.user });
    res.render('hostels/details', { hostel, error: null, user: req.session.user });
  } catch { res.render('hostels/details', { hostel: null, error: 'Hostel not found', user: req.session.user }); }
});

// Roommate Pages
app.get('/roommates', (req, res) => res.render('roommates/index', { user: req.session.user }));

app.get('/roommates/profile/create', (req, res) => res.render('roommates/create-profile', { error: null, user: req.session.user }));

app.post('/roommates/profile/create', async (req, res) => {
  try {
    const timestamp = Date.now().toString(16);
    const random = Math.random().toString(16).substring(2, 10);
    const uniqueId = (timestamp + random).padEnd(24, '0').substring(0, 24);
    const userId = req.session.user?.id || uniqueId;

    await RoommateProfile.create({
      user: userId,
      bio: req.body.bio,
      age: req.body.age,
      occupation: req.body.occupation,
      budget: { min: req.body.budgetMin, max: req.body.budgetMax },
      preferredLocation: { city: req.body.city, areas: req.body.areas ? req.body.areas.split(',').map(a => a.trim()) : [] },
      preferences: {
        gender: req.body.gender, smoking: req.body.smoking, drinking: req.body.drinking,
        pets: req.body.pets, foodPreference: req.body.foodPreference,
        sleepSchedule: req.body.sleepSchedule, cleanliness: req.body.cleanliness
      },
      interests: req.body.interests ? req.body.interests.split(',').map(i => i.trim()) : [],
      lookingFor: req.body.lookingFor
    });
    req.session.userId = userId;
    res.redirect('/roommates/matches');
  } catch (e) { res.render('roommates/create-profile', { error: e.message, user: req.session.user }); }
});

app.get('/roommates/matches', async (req, res) => {
  try {
    const myProfile = await RoommateProfile.findOne({ user: req.session.userId });
    if (!myProfile) return res.render('roommates/matches', { matches: [], error: null, user: req.session.user });
    const matches = await RoommateProfile.find({
      isActive: true, _id: { $ne: myProfile._id },
      'preferredLocation.city': myProfile.preferredLocation.city,
      'budget.min': { $lte: myProfile.budget.max },
      'budget.max': { $gte: myProfile.budget.min }
    });
    const scoredMatches = matches
      .map(m => ({ ...m.toObject(), compatibilityScore: Math.floor(Math.random() * 40) + 60 }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    res.render('roommates/matches', { matches: scoredMatches, error: null, user: req.session.user });
  } catch { res.render('roommates/matches', { matches: [], error: null, user: req.session.user }); }
});

// Admin Pages
app.get('/admin', requireAdmin, async (req, res) => {
  try {
    const [totalUsers, verifiedUsers, totalHostels, verifiedHostels, pendingHostels] = await Promise.all([
      User.countDocuments(), User.countDocuments({ isVerified: true }),
      Hostel.countDocuments(), Hostel.countDocuments({ isVerified: true }), Hostel.countDocuments({ isVerified: false })
    ]);
    res.render('admin/dashboard', { stats: { totalUsers, verifiedUsers, totalHostels, verifiedHostels, pendingHostels }, error: null, user: req.session.user });
  } catch { res.render('admin/dashboard', { stats: { totalUsers: 0, verifiedUsers: 0, totalHostels: 0, verifiedHostels: 0, pendingHostels: 0 }, error: 'Failed to load stats', user: req.session.user }); }
});

app.get('/admin/hostels/pending', requireAdmin, async (req, res) => {
  try {
    const hostels = await Hostel.find({ isVerified: false }).populate('owner', 'name email phone').sort('-createdAt');
    res.render('admin/pending-hostels', { hostels, error: null, user: req.session.user });
  } catch { res.render('admin/pending-hostels', { hostels: [], error: 'Failed to load hostels', user: req.session.user }); }
});

app.post('/admin/hostels/:id/verify', requireAdmin, async (req, res) => {
  await Hostel.findByIdAndUpdate(req.params.id, { isVerified: true });
  res.redirect('/admin/hostels/pending');
});

app.post('/admin/hostels/:id/reject', requireAdmin, async (req, res) => {
  await Hostel.findByIdAndDelete(req.params.id);
  res.redirect('/admin/hostels/pending');
});

app.get('/admin/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.render('admin/users', { users, error: null, user: req.session.user });
  } catch { res.render('admin/users', { users: [], error: 'Failed to load users', user: req.session.user }); }
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
