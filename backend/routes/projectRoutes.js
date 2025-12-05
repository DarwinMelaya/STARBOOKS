const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// Create new project record
router.post("/", createProject);

// Get all projects
router.get("/", getProjects);

// Get single project by ID
router.get("/:id", getProjectById);

// Update project
router.patch("/:id", updateProject);
router.put("/:id", updateProject);

// Delete project
router.delete("/:id", deleteProject);

module.exports = router;
