const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const verifyToken = require("../middleware/verifyToken");

// GET all jobs — public
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single job — public
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST add job — protected
router.post("/", verifyToken, async (req, res) => {
  try {
    const newJob = new Job({
      role: req.body.role,
      company: req.body.company,
      salary: req.body.salary,
      postedBy: req.userId
    });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE job — protected + only owner can delete
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }

    // Check if logged in user is the owner
    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this job!" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully! ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;