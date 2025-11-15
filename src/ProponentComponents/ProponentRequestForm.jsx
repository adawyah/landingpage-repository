import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Collaboration.css";

export default function ProponentRequestForm({ onClose }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    middle_initial: "",
    programcollege_id: "",
    advisor_id: "",
  });
  const [programs, setPrograms] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [advisorSearch, setAdvisorSearch] = useState("");
  const [filteredAdvisors, setFilteredAdvisors] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      try {
        // Load programs and advisors from backend
        const [progRes, advRes] = await Promise.all([
          axios.get("/program-colleges"),
          axios.get("/advisors"),
        ]);

        setPrograms(progRes.data);
        setAdvisors(advRes.data);
        setFilteredAdvisors(advRes.data);
      } catch (err) {
        console.error("Failed to load dropdowns", err.response?.data || err);
      }
    }
    loadOptions();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdvisorSearch = (e) => {
    const value = e.target.value;
    setAdvisorSearch(value);
    setShowSuggestions(true);

    const filtered = advisors.filter((a) =>
      `${a.first_name} ${a.last_name}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAdvisors(filtered);
  };

  const handleSelectAdvisor = (advisor) => {
    setForm({ ...form, advisor_id: advisor.id });
    setAdvisorSearch(`${advisor.first_name} ${advisor.last_name}`);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/role-requests", {
        role: "proponent",
        meta: form,
      });

      alert("Proponent request submitted!");
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
        <h2>Request Proponent Role</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
          <input
            name="middle_initial"
            placeholder="Middle Initial"
            value={form.middle_initial}
            onChange={handleChange}
          />

          {/* 🔹 Program Dropdown instead of Department */}
          <select
            name="programcollege_id"
            value={form.programcollege_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Searchable Advisor Input */}
          <div className="advisor-search">
            <input
              type="text"
              placeholder="Search Advisor"
              value={advisorSearch}
              onChange={handleAdvisorSearch}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && advisorSearch && (
              <ul className="suggestions">
                {filteredAdvisors.length > 0 ? (
                  filteredAdvisors.map((a) => (
                    <li
                      key={a.id}
                      onClick={() => handleSelectAdvisor(a)}
                      className="suggestion-item"
                    >
                      {a.first_name} {a.last_name}
                    </li>
                  ))
                ) : (
                  <li className="no-suggestion">No advisor found</li>
                )}
              </ul>
            )}
          </div>

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
