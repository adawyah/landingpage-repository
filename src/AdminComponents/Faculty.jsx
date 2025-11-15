import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import "./Faculty.css";

export default function Faculty() {
  const [requests, setRequests] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [approvedRCs, setApprovedRCs] = useState([]);
  const [pendingRCs, setPendingRCs] = useState([]);
  const [loadingRCs, setLoadingRCs] = useState(false);
  const [activeTab, setActiveTab] = useState("approved"); // 'approved' or 'pending'

  useEffect(() => {
    fetchRequests();
    fetchProgramList();
  }, []);

  // ✅ Load pending RC requests (admin only)
  async function fetchRequests() {
    try {
      setLoading(true);
      const res = await axios.get("/role-requests/pending");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch pending RC requests", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Load all programs
  async function fetchProgramList() {
    try {
      const res = await axios.get("/program-colleges");
      setPrograms(res.data);
    } catch (err) {
      console.error("Failed to fetch programs", err.response?.data || err.message);
    }
  }

  // ✅ When admin clicks a program card
  async function handleViewProgram(program) {
    setSelectedProgram(program);
    setApprovedRCs([]);
    setPendingRCs([]);
    setLoadingRCs(true);

    try {
      // Fetch approved RCs
      // const rcRes = await axios.get("/research-coordinators");
      const rcRes = await axios.get("/research-coordinators");

      const approved = rcRes.data.filter((rc) => rc.programcollege_id === program.id);
      setApprovedRCs(approved);

      // Filter pending RCs by program
      // const pending = requests.filter(
      //   (r) => r.meta.programcollege_id === program.id && r.role === "research_coordinator"
      // );
      const pending = requests.filter(
  (r) =>
    r.role === "research_coordinator" &&
    r.meta &&
    Number(r.meta.programcollege_id) === Number(program.id)
);

      setPendingRCs(pending);
    } catch (err) {
      console.error("Failed to load RCs", err.response?.data || err.message);
    } finally {
      setLoadingRCs(false);
    }
  }

  const closeModal = () => {
    setSelectedProgram(null);
    setApprovedRCs([]);
    setPendingRCs([]);
  };

  // ✅ Approve RC request
  async function handleApprove(id) {
    try {
      await axios.patch(`/role-requests/${id}/approve`);
      alert("Research Coordinator approved!");
      fetchRequests();
      if (selectedProgram) handleViewProgram(selectedProgram);
    } catch (err) {
      console.error("Approve failed:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.message || "Failed to approve"));
    }
  }

  // ✅ Reject RC request
  async function handleReject(id) {
    const remarks = prompt("Enter rejection remarks (optional):");
    try {
      await axios.patch(`/role-requests/${id}/reject`, { remarks });
      alert("Request rejected!");
      fetchRequests();
      if (selectedProgram) handleViewProgram(selectedProgram);
    } catch (err) {
      console.error("Reject failed:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.message || "Failed to reject"));
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="faculty-container">
      {/* Header */}
      <header className="faculty-header">
        <h1>Research Coordinator Management</h1>
        <p>View and approve Research Coordinator requests per program</p>
      </header>

      {/* ✅ Programs */}
      <section className="programs">
        <h2>Programs</h2>
        <div className="departments-grid">
          {programs.map((program) => (
            <div
              key={program.id}
              className="department-card"
              onClick={() => handleViewProgram(program)}
            >
              <h3>{program.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Modal for RCs */}
      {selectedProgram && (
        <div className="modal-overlay fade-in">
          <div className="modal scale-in">
            <header className="modal-header">
              <h2>{selectedProgram.name} – Research Coordinators</h2>
              <button className="btn-close" onClick={closeModal}>
                <X size={18} />
              </button>
            </header>

            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === "approved" ? "active" : ""}`}
                onClick={() => setActiveTab("approved")}
              >
                Approved
              </button>
              <button
                className={`tab ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </button>
            </div>

            {/* Content per tab */}
            {loadingRCs ? (
              <p className="loading">Loading...</p>
            ) : activeTab === "approved" ? (
              approvedRCs.length === 0 ? (
                <p className="empty-message">No approved RCs yet.</p>
              ) : (
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Employee ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedRCs.map((rc) => (
                      <tr key={rc.id}>
                        <td>
                          {rc.first_name}{" "}
                          {rc.middle_initial && rc.middle_initial + ". "}{" "}
                          {rc.last_name}
                        </td>
                        <td>{rc.employee_id || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : pendingRCs.length === 0 ? (
              <p className="empty-message">No pending RC requests.</p>
            ) : (
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Employee ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRCs.map((r) => (
                    <tr key={r.id}>
                      <td>
                        {r.meta.first_name}{" "}
                        {r.meta.middle_initial && r.meta.middle_initial + ". "}{" "}
                        {r.meta.last_name}
                      </td>
                      <td>{r.meta.employee_id || "-"}</td>
                      <td className="actions">
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(r.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(r.id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
