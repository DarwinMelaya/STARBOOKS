const mongoose = require("mongoose");

const implementationSchema = new mongoose.Schema(
  {
    place: {
      type: String,
      required: [true, "Implementation place is required"],
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
    implemented: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Implementation = mongoose.model("Implementation", implementationSchema);

module.exports = Implementation;


