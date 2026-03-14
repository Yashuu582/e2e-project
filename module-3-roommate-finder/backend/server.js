const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/roommates', require('./routes/roommateRoutes'));

app.get('/health', (req, res) => res.json({ status: 'OK', module: 'Roommate Finder' }));

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`Module 3 running on port ${PORT}`));
