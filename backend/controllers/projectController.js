const Project = require("../models/Project");

// Create new project record
const createProject = async (req, res) => {
  try {
    const { projectTitle, location, coordinates, programType } = req.body;

    if (!projectTitle || !location || !coordinates || !programType) {
      return res.status(400).json({
        success: false,
        message: "Project title, location, coordinates, and program type are required",
      });
    }

    let lat;
    let lng;

    if (typeof coordinates === "string") {
      const parts = coordinates.split(",").map((p) => p.trim());
      if (parts.length !== 2) {
        return res.status(400).json({
          success: false,
          message: "Coordinates must be in 'lat, lng' format",
        });
      }
      lat = parseFloat(parts[0]);
      lng = parseFloat(parts[1]);
    } else if (
      typeof coordinates === "object" &&
      coordinates.lat != null &&
      coordinates.lng != null
    ) {
      lat = Number(coordinates.lat);
      lng = Number(coordinates.lng);
    }

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Coordinates must be valid numbers",
      });
    }

    const project = await Project.create({
      projectTitle,
      location,
      coordinates: { lat, lng },
      programType,
    });

    res.status(201).json({
      success: true,
      message: "Project record created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message,
    });
  }
};

// Get all project records
const getProjects = async (req, res) => {
  try {
    const records = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

// Get single project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: error.message,
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectTitle, location, coordinates, programType } = req.body;

    const updateData = {};
    if (projectTitle) updateData.projectTitle = projectTitle;
    if (location) updateData.location = location;
    if (programType) updateData.programType = programType;
    if (coordinates) {
      let lat;
      let lng;

      if (typeof coordinates === "string") {
        const parts = coordinates.split(",").map((p) => p.trim());
        if (parts.length !== 2) {
          return res.status(400).json({
            success: false,
            message: "Coordinates must be in 'lat, lng' format",
          });
        }
        lat = parseFloat(parts[0]);
        lng = parseFloat(parts[1]);
      } else if (
        typeof coordinates === "object" &&
        coordinates.lat != null &&
        coordinates.lng != null
      ) {
        lat = Number(coordinates.lat);
        lng = Number(coordinates.lng);
      }

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return res.status(400).json({
          success: false,
          message: "Coordinates must be valid numbers",
        });
      }

      updateData.coordinates = { lat, lng };
    }

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message,
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};

