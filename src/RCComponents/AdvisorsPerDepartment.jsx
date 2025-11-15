import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import "./AdvisorsPerDepartment.css"; // You can reuse the same CSS as before

export default function AdvisorsPerDepartment() {
  const [approvedAdvisors, setApprovedAdvisors] = useState([]);
  const [pendingAdvisors, setPendingAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("approved"); // "approved" or "pending"

  useEffect(() => {
    fetchAdvisors();
  }, []);

  // ✅ Fetch both approved + pending advisors related to this RC
  async function fetchAdvisors() {
    try {
      setLoading(true);
      const res = await axios.get("/role-requests/rc/advisors");
      setApprovedAdvisors(res.data.approved_advisors || []);
      setPendingAdvisors(res.data.pending_requests || []);
    } catch (err) {
      console.error("Failed to load advisors", err.response?.data || err.message);
      alert("Error loading advisors");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Approve pending advisor
  async function handleApprove(id) {
    try {
      // await axios.patch(`/role-requests/${id}/approve`);
      await axios.patch(`/role-requests/${id}/approve-advisor`);

      alert("Advisor request approved!");
      fetchAdvisors();
    } catch (err) {
      console.error("Approve failed:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.message || "Failed to approve"));
    }
  }

  // ✅ Reject pending advisor
  async function handleReject(id) {
    const remarks = prompt("Enter rejection remarks (optional):");
    try {
      await axios.patch(`/role-requests/${id}/reject-advisor`, { remarks });
      alert("Advisor request rejected!");
      fetchAdvisors();
    } catch (err) {
      console.error("Reject failed:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.message || "Failed to reject"));
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading advisor data...</p>
      </div>
    );
  }

  return (
    <div className="faculty-container">
      <header className="faculty-header">
        <h1>Advisors Management</h1>
        <p>Review and approve advisor requests for your department</p>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "approved" ? "active" : ""}`}
          onClick={() => setActiveTab("approved")}
        >
          Approved Advisors
        </button>
        <button
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </button>
      </div>

      {/* Content per tab */}
      <div className="table-wrapper">
        {activeTab === "approved" ? (
          approvedAdvisors.length === 0 ? (
            <p className="empty-message">No approved advisors yet.</p>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                </tr>
              </thead>
              <tbody>
                {approvedAdvisors.map((advisor) => (
                  <tr key={advisor.id}>
                    <td>
                      {advisor.first_name}{" "}
                      {advisor.middle_initial && advisor.middle_initial + ". "}{" "}
                      {advisor.last_name}
                    </td>
                    <td>{advisor.employee_id || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : pendingAdvisors.length === 0 ? (
          <p className="empty-message">No pending advisor requests.</p>
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
              {pendingAdvisors.map((r) => (
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
  );
}
