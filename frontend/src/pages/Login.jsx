import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields!");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      // Save token and user to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to home
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="auth-container">
      <h2>👋 Welcome Back!</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;