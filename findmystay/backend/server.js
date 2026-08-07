const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => { console.error(err); process.exit(1); });

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hostels', require('./routes/hostelRoutes'));
app.use('/api/roommates', require('./routes/roommateRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/health', (req, res) => res.json({ status: 'OK', app: 'FindMyStay' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`FindMyStay backend running on port ${PORT}`));
