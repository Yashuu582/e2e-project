const Hostel = require('../models/Hostel');

exports.createHostel = async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);
    res.status(201).json({ success: true, hostel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllHostels = async (req, res) => {
  try {
    const { city, hostelType, search } = req.query;
    let query = {};
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (hostelType) query.hostelType = hostelType;
    if (search) query.name = new RegExp(search, 'i');
    const hostels = await Hostel.find(query);
    res.json({ success: true, count: hostels.length, hostels });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    res.json({ success: true, hostel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    if (req.user && hostel.owner && hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, hostel: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    await hostel.deleteOne();
    res.json({ success: true, message: 'Hostel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    hostel.reviews.push({ user: req.user?.id, rating, comment });
    hostel.rating = hostel.reviews.reduce((acc, r) => r.rating + acc, 0) / hostel.reviews.length;
    await hostel.save();
    res.json({ success: true, hostel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
