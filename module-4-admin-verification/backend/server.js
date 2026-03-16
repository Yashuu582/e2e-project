const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://findmystay:findmystay@findmystay.stufssv.mongodb.net/findmystay?retryWrites=true&w=majority&appName=findmystay';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/health', (req, res) => res.json({ status: 'OK', module: 'Admin Verification', version: '2.0' }));

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => console.log(`Module 4 running on port ${PORT}`));
