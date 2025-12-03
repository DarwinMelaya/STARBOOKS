const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
} = require("../controllers/userController");

// Create a new user
router.post("/register", createUser);

// Login user
router.post("/login", loginUser);

// Get all users
router.get("/", getAllUsers);

// Get user by ID
router.get("/:id", getUserById);

module.exports = router;
