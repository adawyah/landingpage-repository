import React, { useState, useEffect } from "react";
// CORRECT
import PDFViewer from "./PDFViewer"; 

import { api } from "../api";
import "./CollabDetail.css";

export default function CollaborationDetail({ collab, onBack }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);



  // Fetch papers & versions
  useEffect(() => {
    const fetchPapers = async () => {
      if (!collab?.id) return;
      setLoading(true);
      try {
        const res = await api.get(`/collaborations/${collab.id}/papers`);
        const papersData = res.data.papers || [];

        const versionsList = await Promise.all(
          papersData.map(async (paper) => {
            const filesRes = await api.get(`/papers/${paper.id}/files`);
            const files = filesRes.data.files || [];

            const versions = await Promise.all(
              files.map(async (file) => {
                const vRes = await api.get(`/files/${file.id}/versions`);
                return vRes.data.versions.map((v) => ({
                  ...v,
                  title: paper.title,
                  paper_id: paper.id,
                  status: v.status || "draft",
                }));
              })
            );

            return versions.flat();
          })
        );

        setPapers(versionsList.flat().sort((a, b) => b.version_number - a.version_number));
      } catch (err) {
        console.error("Error fetching papers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [collab?.id]);

  // Update version status
  const handleStatusChange = async (versionId, newStatus) => {
    if (!versionId) return;
    try {
      const res = await api.patch(`/versions/${versionId}/status`, { status: newStatus });
      setPapers((prev) => prev.map((v) => (v.id === versionId ? { ...v, status: newStatus } : v)));
      alert(res.data.message || "Version status updated.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update version status.");
    }
  };

  const latestVersions = papers.reduce((acc, v) => {
    if (!acc[v.paper_id] || v.version_number > acc[v.paper_id]) acc[v.paper_id] = v.version_number;
    return acc;
  }, {});

  if (loading) return <p>Loading collaboration details...</p>;

  return (
    <div className="collab-detail">
      <button className="btn btn-outline" onClick={onBack}>← Back</button>
      <h2>{collab.title}</h2>
      <p>{collab.description}</p>
      <p>
        Members: {collab.members?.length ? collab.members.map((m) => m.user?.first_name).join(", ") : "No members"}
      </p>

      <div className="papers-list">
        {papers.length === 0 && <p>No papers uploaded yet.</p>}

        {papers.map((v, i) => {
          const isLatest = v.version_number === latestVersions[v.paper_id];
          return (
            <div
              key={v.id || i}
              className="paper-card"
              style={{ cursor: "pointer", position: "relative", padding: "1rem" }}
              onClick={() => {
                setSelectedVersion(v);
                setShowPdfViewer(true);
              }}
            >
              <h4>{`V${v.version_number} - ${v.title}`}</h4>
              <p>Date: {new Date(v.created_at).toLocaleString()}</p>
              <p>
                <strong>Status:</strong>{" "}
                <select
                  value={v.status || "draft"}
                  disabled={!isLatest}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(v.id, e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                {!isLatest && <small style={{ color: "gray", marginLeft: "5px" }}>(Old version — cannot edit)</small>}
              </p>
            </div>
          );
        })}
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && selectedVersion && (
        <div className="pdf-modal-overlay">
          <div className="pdf-modal">
            <div className="pdf-modal-header">
              <h3>{selectedVersion.title} (V{selectedVersion.version_number})</h3>
              <button className="close-pdf-btn" onClick={() => { setShowPdfViewer(false); setSelectedVersion(null); }}>×</button>
            </div>

            <div style={{ height: "80vh" }}>
              <div style={{ height: "100%", overflow: "auto", position: "relative", background: "#eee" }}>
                <PDFViewer fileId={selectedVersion.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
