import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function ResumeMatch() {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file || !jobTitle || !jobDescription) {
      setError("Please fill all fields and upload your resume!");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobTitle", jobTitle);
      formData.append("jobCompany", jobCompany);
      formData.append("jobDescription", jobDescription);

      const res = await axios.post(
        `${API_URL}/api/resume/match`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(res.data);
    } catch (err) {
      setError("Failed to analyze resume. Try again!");
    }

    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#27ae60";
    if (score >= 60) return "#f39c12";
    if (score >= 40) return "#e67e22";
    return "#e94560";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "#eafaf1";
    if (score >= 60) return "#fef9e7";
    if (score >= 40) return "#fdf2e9";
    return "#fdf0f0";
  };

  return (
    <div style={{ maxWidth: "900px", margin: "32px auto", padding: "0 16px" }}>

      <h1 style={{ marginBottom: "8px", color: "#1a1a2e" }}>
        AI Resume Matcher
      </h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        Upload your resume and paste a job description to get your match score!
      </p>

      {/* Input Form */}
      <div style={{
        background: "white",
        padding: "32px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginBottom: "32px"
      }}>
        <h2 style={{ marginBottom: "24px", color: "#1a1a2e" }}>
          Step 1 — Upload Your Resume
        </h2>

        {/* File Upload */}
        <div style={{
          border: "2px dashed #ddd",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          marginBottom: "24px",
          background: file ? "#eafaf1" : "#fafafa"
        }}>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
            id="resumeUpload"
          />
          <label htmlFor="resumeUpload" style={{ cursor: "pointer" }}>
            <p style={{ fontSize: "32px", marginBottom: "8px" }}>
              {file ? "✅" : "📄"}
            </p>
            <p style={{ color: "#666", marginBottom: "8px" }}>
              {file ? file.name : "Click to upload your Resume (PDF)"}
            </p>
            <span style={{
              padding: "8px 20px",
              background: "#1a1a2e",
              color: "white",
              borderRadius: "8px",
              fontSize: "14px"
            }}>
              {file ? "Change File" : "Choose PDF"}
            </span>
          </label>
        </div>

        <h2 style={{ marginBottom: "16px", color: "#1a1a2e" }}>
          Step 2 — Enter Job Details
        </h2>

        <input
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "15px",
            marginBottom: "12px",
            outline: "none",
            boxSizing: "border-box"
          }}
          placeholder="Job Title (e.g. Full Stack Developer)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <input
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "15px",
            marginBottom: "12px",
            outline: "none",
            boxSizing: "border-box"
          }}
          placeholder="Company Name (e.g. Infosys)"
          value={jobCompany}
          onChange={(e) => setJobCompany(e.target.value)}
        />

        <textarea
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px",
            outline: "none",
            minHeight: "200px",
            resize: "vertical",
            boxSizing: "border-box",
            lineHeight: "1.6"
          }}
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {error && (
          <p style={{ color: "#e94560", marginBottom: "16px" }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#ccc" : "#e94560",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Analyzing with AI... Please wait..." : "Analyze My Resume"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div>
          {/* Match Score */}
          <div style={{
            background: getScoreBg(result.analysis.matchScore),
            border: `2px solid ${getScoreColor(result.analysis.matchScore)}`,
            borderRadius: "12px",
            padding: "32px",
            textAlign: "center",
            marginBottom: "24px"
          }}>
            <p style={{ color: "#666", marginBottom: "8px", fontSize: "16px" }}>
              Match Score for {result.jobTitle} at {result.jobCompany}
            </p>
            <div style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: getScoreColor(result.analysis.matchScore),
              lineHeight: 1
            }}>
              {result.analysis.matchScore}%
            </div>
            <div style={{
              display: "inline-block",
              padding: "6px 20px",
              background: getScoreColor(result.analysis.matchScore),
              color: "white",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "bold",
              marginTop: "12px"
            }}>
              {result.analysis.matchLevel} Match
            </div>
            <p style={{
              marginTop: "16px",
              color: "#555",
              fontSize: "15px",
              lineHeight: "1.6"
            }}>
              {result.analysis.summary}
            </p>
          </div>

          {/* Skills Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "24px"
          }}>
            {/* Matched Skills */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{ color: "#27ae60", marginBottom: "16px" }}>
                Matched Skills
              </h3>
              {result.analysis.matchedSkills.map((skill, i) => (
                <span key={i} style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  background: "#eafaf1",
                  color: "#27ae60",
                  borderRadius: "20px",
                  fontSize: "13px",
                  margin: "4px",
                  fontWeight: "bold"
                }}>
                  {skill}
                </span>
              ))}
            </div>

            {/* Missing Skills */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{ color: "#e94560", marginBottom: "16px" }}>
                Missing Skills
              </h3>
              {result.analysis.missingSkills.map((skill, i) => (
                <span key={i} style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  background: "#fdf0f0",
                  color: "#e94560",
                  borderRadius: "20px",
                  fontSize: "13px",
                  margin: "4px",
                  fontWeight: "bold"
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
          }}>
            {/* Strengths */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{ color: "#1a1a2e", marginBottom: "16px" }}>
                Your Strengths
              </h3>
              {result.analysis.strengths.map((s, i) => (
                <p key={i} style={{
                  padding: "10px 14px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "#555",
                  borderLeft: "3px solid #27ae60"
                }}>
                  {s}
                </p>
              ))}
            </div>

            {/* Improvements */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{ color: "#1a1a2e", marginBottom: "16px" }}>
                Areas to Improve
              </h3>
              {result.analysis.improvements.map((item, i) => (
                <p key={i} style={{
                  padding: "10px 14px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "#555",
                  borderLeft: "3px solid #e94560"
                }}>
                  {item}
                </p>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default ResumeMatch;