import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Collaboration.css";

export default function ResearchCoordinatorRequestForm({ onClose }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    middle_initial: "",
    employee_id: "",
    programcollege_id: "",
  });
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await axios.get("/program-colleges");
        setPrograms(res.data);
      } catch (err) {
        console.error("Failed to load program colleges", err.response?.data || err);
      }
    }
    loadPrograms();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/role-requests", {
        role: "research_coordinator",
        meta: form,
      });
      alert("Research Coordinator request submitted!");
      onClose();
    } catch (err) {
      console.error("Submit failed:", err.response?.data || err.message);
      alert(
        "Error: " +
          (err.response?.data?.message || "Failed to submit request")
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Request Research Coordinator Role</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="middle_initial"
            placeholder="Middle Initial"
            value={form.middle_initial}
            onChange={handleChange}
          />
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID (optional)"
            value={form.employee_id}
            onChange={handleChange}
          />

          <select
            name="programcollege_id"
            value={form.programcollege_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Program College</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
