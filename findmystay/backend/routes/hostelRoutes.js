const router = require('express').Router();
const { createHostel, getAllHostels, getHostelById, updateHostel, deleteHostel, addReview } = require('../controllers/hostelController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', getAllHostels);
router.post('/', protect, restrictTo('provider', 'admin'), createHostel);
router.get('/:id', getHostelById);
router.put('/:id', protect, restrictTo('provider', 'admin'), updateHostel);
router.delete('/:id', protect, restrictTo('provider', 'admin'), deleteHostel);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
