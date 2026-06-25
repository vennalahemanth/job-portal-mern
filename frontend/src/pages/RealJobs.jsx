import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function RealJobs() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Hyderabad");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const searchJobs = async () => {
    if (!query) {
      setError("Please enter a job role!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/api/search`, {
        params: { query, location }
      });
      setJobs(res.data.jobs);
      setSearched(true);
    } catch (err) {
      setError("Failed to fetch jobs. Try again!");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "32px auto", padding: "0 16px" }}>

      <h1 style={{ marginBottom: "8px", color: "#1a1a2e" }}>
        Live Job Listings
      </h1>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Real jobs from LinkedIn, Indeed, Internshala and more!
      </p>

      <div style={{
        background: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginBottom: "32px",
        display: "flex",
        gap: "12px",
        flexWrap: "wrap"
      }}>
        <input
          style={{
            flex: 2,
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "15px",
            outline: "none",
            minWidth: "200px"
          }}
          placeholder="Job role (e.g. React Developer, ML Engineer)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          style={{
            flex: 1,
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "15px",
            outline: "none",
            minWidth: "150px"
          }}
          placeholder="Location (e.g. Hyderabad)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={searchJobs}
          style={{
            padding: "12px 28px",
            background: "#e94560",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "bold"
          }}
        >
          Search Jobs
        </button>
      </div>

      {error && (
        <p style={{ color: "#e94560", textAlign: "center", marginBottom: "16px" }}>
          {error}
        </p>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
          Searching LinkedIn, Indeed, Internshala...
        </div>
      )}

      {searched && !loading && (
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Found {jobs.length} jobs for {query} in {location}
        </p>
      )}

      {!loading && jobs.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px"
        }}>
          {jobs.map((job) => (
            <div key={job.id} style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column"
            }}>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px"
              }}>
                {job.logo ? (
                  <img
                    src={job.logo}
                    alt={job.company}
                    style={{
                      width: "45px",
                      height: "45px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: "1px solid #eee"
                    }}
                  />
                ) : (
                  <div style={{
                    width: "45px",
                    height: "45px",
                    background: "#e94560",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px"
                  }}>
                    {job.company ? job.company[0] : "J"}
                  </div>
                )}
                <div>
                  <h2 style={{
                    fontSize: "15px",
                    color: "#1a1a2e",
                    margin: 0,
                    lineHeight: "1.3"
                  }}>
                    {job.role}
                  </h2>
                  <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>
                    {job.company}
                  </p>
                </div>
              </div>

              <p style={{ margin: "4px 0", color: "#555", fontSize: "14px" }}>
                Location: {job.location || "Hyderabad"}
              </p>
              <p style={{ margin: "4px 0", color: "#27ae60", fontSize: "14px", fontWeight: "bold" }}>
                Salary: {job.salary}
              </p>
              <p style={{ margin: "4px 0", color: "#555", fontSize: "14px" }}>
                Type: {job.type || "Full Time"}
              </p>

              <span style={{
                display: "inline-block",
                padding: "4px 12px",
                background: "#f0f4ff",
                borderRadius: "20px",
                fontSize: "12px",
                color: "#4a6cf7",
                fontWeight: "bold",
                margin: "12px 0",
                width: "fit-content"
              }}>
                via {job.source}
              </span>

              <p style={{
                fontSize: "13px",
                color: "#888",
                marginBottom: "16px",
                lineHeight: "1.6",
                flexGrow: 1
              }}>
                {job.description}
              </p>

              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px",
                  background: "#1a1a2e",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}
              >
                Apply Now
              </a>

            </div>
          ))}
        </div>
      )}

      {searched && !loading && jobs.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
          <p style={{ fontSize: "18px" }}>No jobs found!</p>
          <p>Try different keywords or location</p>
        </div>
      )}

      {!searched && !loading && (
        <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
          <p style={{ fontSize: "18px" }}>Search for jobs to see live listings!</p>
          <p>Try: Full Stack Developer, ML Engineer, React Developer</p>
        </div>
      )}

    </div>
  );
}

export default RealJobs;
