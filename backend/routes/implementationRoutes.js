const express = require("express");
const router = express.Router();
const {
  createImplementation,
  getImplementations,
  updateImplementationStatus,
} = require("../controllers/implementationController");

// Create new implementation record
router.post("/", createImplementation);

// Get all implementations
router.get("/", getImplementations);

// Update implementation status
router.patch("/:id", updateImplementationStatus);

module.exports = router;