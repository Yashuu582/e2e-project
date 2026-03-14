const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPendingHostels,
  verifyHostel,
  rejectHostel,
  getAllUsers,
  verifyUser,
  deleteUser
} = require('../controllers/adminController');
const { restrictToAdmin } = require('../middleware/roleMiddleware');

const protect = (req, res, next) => {
  req.user = { id: 'admin', role: 'admin' };
  next();
};

router.get('/stats', protect, restrictToAdmin, getDashboardStats);
router.get('/hostels/pending', protect, restrictToAdmin, getPendingHostels);
router.put('/hostels/:id/verify', protect, restrictToAdmin, verifyHostel);
router.delete('/hostels/:id/reject', protect, restrictToAdmin, rejectHostel);
router.get('/users', protect, restrictToAdmin, getAllUsers);
router.put('/users/:id/verify', protect, restrictToAdmin, verifyUser);
router.delete('/users/:id', protect, restrictToAdmin, deleteUser);

module.exports = router;
