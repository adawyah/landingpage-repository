
import React, { useState } from "react";
import axios from "axios";
import "./auth.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:8000/api/register", form, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess("Registration successful! Please login.");
    } catch (err) {
      setError("Register failed. Please check your input.");
    }
  };

  return (
    <div className="auth-form-center">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success" style={{color:'#276749',background:'#f0fff4',border:'1px solid #68d391',borderRadius:'0.4rem',padding:'0.5rem 0.8rem',marginBottom:'0.5rem',fontSize:'0.97rem'}}>{success}</div>}
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="first_name" placeholder="First name" onChange={handleChange} required />
        <input name="last_name" placeholder="Last name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="password_confirmation" type="password" placeholder="Confirm Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
