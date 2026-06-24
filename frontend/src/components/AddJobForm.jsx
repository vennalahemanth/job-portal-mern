import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function AddJobForm({ onJobAdded }) {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!role || !company || !salary) {
      setMessage("Please fill all fields!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/jobs`,
        { role, company, salary: parseInt(salary) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onJobAdded(res.data);
      setRole("");
      setCompany("");
      setSalary("");
      setMessage("Job added successfully! ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to add job. Please login first!");
    }
  };

  return (
    <div className="add-job-form">
      <h2>➕ Post a New Job</h2>
      {message && (
        <p className={message.includes("✅") ? "success" : "error"}>
          {message}
        </p>
      )}
      <input
        placeholder="Job Role (e.g. React Developer)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <input
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <input
        placeholder="Monthly Salary (e.g. 75000)"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        type="number"
      />
      <button onClick={handleSubmit}>Post Job</button>
    </div>
  );
}

export default AddJobForm;