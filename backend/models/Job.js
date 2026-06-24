const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);