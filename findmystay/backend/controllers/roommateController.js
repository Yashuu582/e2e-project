const RoommateProfile = require('../models/RoommateProfile');

exports.createProfile = async (req, res) => {
  try {
    const profile = await RoommateProfile.create(req.body);
    res.status(201).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await RoommateProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await RoommateProfile.findOneAndUpdate({ user: req.user.id }, req.body, { new: true });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findMatches = async (req, res) => {
  try {
    const userId = req.body.userId || req.user.id;
    const myProfile = await RoommateProfile.findOne({ user: userId });
    if (!myProfile) return res.status(404).json({ message: 'Create your profile first' });

    const matches = await RoommateProfile.find({
      isActive: true,
      _id: { $ne: myProfile._id },
      'preferredLocation.city': myProfile.preferredLocation.city,
      'preferences.gender': { $in: [myProfile.preferences.gender, 'any'] },
      'budget.min': { $lte: myProfile.budget.max },
      'budget.max': { $gte: myProfile.budget.min }
    });

    const scoredMatches = matches
      .map(match => ({ ...match.toObject(), compatibilityScore: Math.floor(Math.random() * 40) + 60 }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json({ success: true, matches: scoredMatches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profile = await RoommateProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
