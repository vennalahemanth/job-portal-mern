import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RealJobs from "./pages/RealJobs";
import ResumeMatch from "./pages/ResumeMatch";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/real-jobs" element={<RealJobs />} />
        <Route path="/resume-match" element={<ResumeMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;