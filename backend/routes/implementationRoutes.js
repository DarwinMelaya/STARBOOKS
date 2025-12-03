const express = require("express");
const router = express.Router();
const {
  createImplementation,
  getImplementations,
} = require("../controllers/implementationController");

// Create new implementation record
router.post("/", createImplementation);

// Get all implementations
router.get("/", getImplementations);

module.exports = router;


