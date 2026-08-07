const router = require('express').Router();
const { getDashboardStats, getPendingHostels, verifyHostel, rejectHostel, getAllUsers, verifyUser, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/hostels/pending', protect, admin, getPendingHostels);
router.put('/hostels/:id/verify', protect, admin, verifyHostel);
router.delete('/hostels/:id/reject', protect, admin, rejectHostel);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/verify', protect, admin, verifyUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
