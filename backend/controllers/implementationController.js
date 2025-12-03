const Implementation = require("../models/Implementation");

// Create new implementation record
const createImplementation = async (req, res) => {
  try {
    const { place, coordinates, implemented } = req.body;

    if (!place || !coordinates) {
      return res.status(400).json({
        success: false,
        message: "Place and coordinates are required",
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

    const implementation = await Implementation.create({
      place,
      coordinates: { lat, lng },
      implemented: !!implemented,
    });

    res.status(201).json({
      success: true,
      message: "Implementation record created successfully",
      data: implementation,
    });
  } catch (error) {
    console.error("Error creating implementation:", error);
    res.status(500).json({
      success: false,
      message: "Error creating implementation",
      error: error.message,
    });
  }
};

// Get all implementation records
const getImplementations = async (req, res) => {
  try {
    const records = await Implementation.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching implementations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching implementations",
      error: error.message,
    });
  }
};

module.exports = {
  createImplementation,
  getImplementations,
};


