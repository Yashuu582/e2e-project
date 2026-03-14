const express = require('express');
const router = express.Router();
const { createProfile, getMyProfile, updateProfile, findMatches, getProfileById } = require('../controllers/roommateController');
const { restrictTo } = require('../middleware/roleMiddleware');

const protect = (req, res, next) => {
  req.user = { id: 'dummy', userType: 'seeker' };
  next();
};

router.post('/profile', protect, restrictTo('seeker', 'provider'), createProfile);
router.get('/profile/me', protect, restrictTo('seeker', 'provider'), getMyProfile);
router.put('/profile', protect, restrictTo('seeker', 'provider'), updateProfile);
router.post('/matches', protect, restrictTo('seeker', 'provider'), findMatches);
router.get('/profile/:id', protect, restrictTo('seeker', 'provider'), getProfileById);

module.exports = router;
