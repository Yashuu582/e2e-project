const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");

router.post("/", hostelController.addHostel);        // Add hostel
router.get("/", hostelController.getHostels);        // List all hostels
router.get("/:id", hostelController.getHostelById);  // Hostel details

module.exports = router;
