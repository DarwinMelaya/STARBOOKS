const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "Longitude is required"],
      },
    },
    programType: {
      type: String,
      required: [true, "Program type is required"],
      enum: [
        "GIA: Grants-In-Aid Program",
        "SETUP: Small Enterprise Technology Upgrading Program",
        "CEST: Community Empowerment through Science and Technology Program",
        "SSCP: Smart and Sustainable Communities Program",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
