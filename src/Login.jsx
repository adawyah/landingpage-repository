
import React, { useState } from "react";
import axios from "axios";
import "./auth.css";

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/api/login", form, {
        headers: { "Content-Type": "application/json" },
      });
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      onLogin({ user, token });
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-form-center">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <input name="email" type="email" placeholder="Email" onChange={handleChange} autoComplete="username" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} autoComplete="current-password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
