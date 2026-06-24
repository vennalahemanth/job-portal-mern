import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      });

      setSuccess("Registered successfully! Redirecting to login... ✅");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="auth-container">
      <h2>🚀 Create Account</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Create Account</button>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;