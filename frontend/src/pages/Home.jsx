import { useState, useEffect } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import AddJobForm from "../components/AddJobForm";

const API_URL = "http://localhost:5000";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs`);
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching jobs:", err);
      setLoading(false);
    }
  };

  const handleJobAdded = (newJob) => {
    setJobs([newJob, ...jobs]);
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`${API_URL}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      alert("Could not delete job!");
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.role.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading jobs... ⏳</div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: "24px", color: "#1a1a2e" }}>
        🔍 Find Your Dream Job
      </h1>

      {/* Search Bar */}
      <input
        className="search-bar"
        placeholder="Search by role or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add Job Form — only for logged in users */}
      {token && <AddJobForm onJobAdded={handleJobAdded} />}

      {/* Job Cards */}
      {filteredJobs.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          No jobs found! 😕
        </p>
      ) : (
        <div className="job-grid">
          {filteredJobs.map(job => (
            <JobCard
              key={job._id}
              job={job}
              onDelete={handleDelete}
              isOwner={user.id === job.postedBy?._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;