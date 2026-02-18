const express = require("express");
const router = express.Router();
const roommateController = require("../controllers/roommateController");

// Create profile
router.post("/create", roommateController.createProfile);

// List all matches
router.get("/matches", roommateController.getMatches);

// Requests
router.get("/requests", roommateController.getRequests);

module.exports = router;
