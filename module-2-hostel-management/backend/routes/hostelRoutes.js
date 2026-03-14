const express = require('express');
const router = express.Router();
const { createHostel, getAllHostels, getHostelById, updateHostel, deleteHostel, addReview } = require('../controllers/hostelController');
const { restrictTo } = require('../middleware/roleMiddleware');

const protect = (req, res, next) => {
  req.user = { id: '507f1f77bcf86cd799439011', userType: 'provider' };
  next();
};

router.get('/', getAllHostels);
router.post('/', protect, restrictTo('provider'), createHostel);
router.get('/:id', getHostelById);
router.put('/:id', protect, restrictTo('provider'), updateHostel);
router.delete('/:id', protect, restrictTo('provider'), deleteHostel);
router.post('/:id/reviews', protect, restrictTo('seeker', 'provider'), addReview);

module.exports = router;
