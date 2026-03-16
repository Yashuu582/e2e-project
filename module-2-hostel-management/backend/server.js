const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://findmystay:findmystay@findmystay.stufssv.mongodb.net/findmystay?retryWrites=true&w=majority&appName=findmystay';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/hostels', require('./routes/hostelRoutes'));

app.get('/health', (req, res) => res.json({ status: 'OK', module: 'Hostel Management', version: '2.0' }));

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Module 2 running on port ${PORT}`));
