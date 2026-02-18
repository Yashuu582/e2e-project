const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Hostel verification
router.get("/hostels", adminController.getHostels);
router.put("/hostels/verify/:id", adminController.verifyHostel);
router.delete("/hostels/reject/:id", adminController.rejectHostel);

// Manage users
router.get("/users", adminController.getUsers);

module.exports = router;
