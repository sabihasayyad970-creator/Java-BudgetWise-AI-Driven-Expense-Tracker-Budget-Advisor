import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed ❌");
        setMessage(data.message || "Signup failed ❌");
        return;
      }

      setMessage(data.message || "Signup successful! ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Server error ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Create Account</h2>
        <p>Sign up to continue</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Enter Username"
            className="auth-input"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-button">
            Sign Up
          </button>

        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="auth-link">
          Already have account? <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;