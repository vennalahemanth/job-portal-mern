const express = require("express");
const router = express.Router();
const axios = require("axios");


router.get("/", async (req, res) => {
  try {
    const { query, location, page } = req.query;

    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search-v2",
      params: {
        query: `${query} in ${location || "India"}`,
        page: page || "1",
        num_pages: "1",
        date_posted: "all",
        country: "in"
      },
      headers: {
        "x-rapidapi-key": process.env.JSEARCH_API_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
        "Content-Type": "application/json"
      }
    };

    const response = await axios.request(options);

    // Correct path: response.data.data.jobs
    const jobsData = response.data.data.jobs;

    if (!Array.isArray(jobsData)) {
      return res.json({ success: true, count: 0, jobs: [] });
    }

    const jobs = jobsData.map(job => ({
      id: job.job_id,
      role: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country,
      salary: job.job_min_salary
        ? `₹${job.job_min_salary} - ₹${job.job_max_salary}`
        : "Not disclosed",
      type: job.job_employment_type,
      description: job.job_description?.slice(0, 200) + "...",
      applyLink: job.job_apply_link,
      logo: job.employer_logo,
      source: job.job_publisher,
      postedAt: job.job_posted_at_datetime_utc
    }));

    res.json({ success: true, count: jobs.length, jobs });

  } catch (err) {
    console.log("JSearch Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs"
    });
  }
});

module.exports = router;