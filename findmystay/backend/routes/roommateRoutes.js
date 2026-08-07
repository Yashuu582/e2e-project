const router = require('express').Router();
const { createProfile, getMyProfile, updateProfile, findMatches, getProfileById } = require('../controllers/roommateController');
const { protect } = require('../middleware/auth');

router.post('/profile', protect, createProfile);
router.get('/profile/me', protect, getMyProfile);
router.put('/profile', protect, updateProfile);
router.post('/matches', protect, findMatches);
router.get('/profile/:id', protect, getProfileById);

module.exports = router;
