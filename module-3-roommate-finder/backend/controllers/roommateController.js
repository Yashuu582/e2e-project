const RoommateProfile = require('../models/RoommateProfile');

exports.createProfile = async (req, res) => {
  try {
    console.log('Received profile data:', JSON.stringify(req.body, null, 2));
    const profile = await RoommateProfile.create(req.body);
    console.log('Profile created:', profile._id);
    res.status(201).json({ success: true, profile });
  } catch (error) {
    console.error('Create profile error:', error);
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
    const profile = await RoommateProfile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findMatches = async (req, res) => {
  try {
    console.log('Finding matches for userId:', req.body.userId || req.user.id);
    const myProfile = await RoommateProfile.findOne({ user: req.body.userId || req.user.id });
    console.log('My profile:', myProfile);
    if (!myProfile) return res.status(404).json({ message: 'Create your profile first' });

    const matches = await RoommateProfile.find({ 
      isActive: true,
      _id: { $ne: myProfile._id },
      'preferredLocation.city': myProfile.preferredLocation.city,
      'preferences.gender': { $in: [myProfile.preferences.gender, 'any'] },
      'budget.min': { $lte: myProfile.budget.max },
      'budget.max': { $gte: myProfile.budget.min }
    });
    
    console.log('Found matches:', matches.length);
    const scoredMatches = matches.map(match => {
      let score = Math.floor(Math.random() * 40) + 60;
      return { ...match.toObject(), compatibilityScore: score };
    });

    scoredMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    console.log('Sending matches:', scoredMatches.length);
    res.json({ success: true, matches: scoredMatches });
  } catch (error) {
    console.error('Match error:', error);
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
