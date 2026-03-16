const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://findmystay:findmystay@findmystay.stufssv.mongodb.net/findmystay?retryWrites=true&w=majority&appName=findmystay';
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
