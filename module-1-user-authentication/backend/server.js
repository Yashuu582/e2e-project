const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

connectDB();

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/health', (req, res) => res.json({ status: 'OK', module: 'User Authentication' }));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Module 1 running on port ${PORT}`));
