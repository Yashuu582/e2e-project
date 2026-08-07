const User = require('../models/User');
const Hostel = require('../models/Hostel');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, verifiedUsers, totalHostels, verifiedHostels, pendingHostels] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVerified: true }),
      Hostel.countDocuments(),
      Hostel.countDocuments({ isVerified: true }),
      Hostel.countDocuments({ isVerified: false })
    ]);
    res.json({ success: true, stats: { totalUsers, verifiedUsers, totalHostels, verifiedHostels, pendingHostels } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ isVerified: false }).populate('owner', 'name email phone').sort('-createdAt');
    res.json({ success: true, count: hostels.length, hostels });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    res.json({ success: true, message: 'Hostel verified', hostel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndDelete(req.params.id);
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    res.json({ success: true, message: 'Hostel rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, message: 'User verified', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
