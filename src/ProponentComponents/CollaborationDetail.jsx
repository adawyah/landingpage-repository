import React, { useState, useEffect } from "react";
import PDFViewer from "./PDFViewer"
import { api } from "../api";
import "./CollabDetail.css";

export default function CollabDetail({ collab, onBack, canUpload }) {
  const [papers, setPapers] = useState([]); // all versions flattened
  const [originalPapers, setOriginalPapers] = useState([]); // actual papers
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);

  // Fetch papers + their files + versions
  const fetchPapers = async () => {
    if (!collab?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/collaborations/${collab.id}/papers`);
      const papersData = res.data.papers;
      setOriginalPapers(papersData);

      const papersWithVersions = await Promise.all(
        papersData.map(async (p) => {
          const filesRes = await api.get(`/papers/${p.id}/files`);
          const files = filesRes.data.files;

          // Get all versions for each file

          
          // const versions = await Promise.all(
          //   files.map(async (f) => {
          //     const vRes = await api.get(`/files/${f.id}/versions`);
          //     return vRes.data.versions.map((v) => ({
          //       ...v,
          //       title: p.title,
          //       // status: p.status,
          //       status: v.status,
          //     }));
          //   })
          // );

          const versions = await Promise.all(
  files.map(async (f) => {
    const vRes = await api.get(`/files/${f.id}/versions`);
    return vRes.data.versions.map((v) => ({
      ...v,
      title: p.title,
      status: v.status, // ✅ use version's status
    }));
  })
);


          return versions.flat();
        })
      );

      setPapers(papersWithVersions.flat());
    } catch (err) {
      console.error("Fetch papers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [collab?.id]);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please choose a file.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF or Word files allowed.");
      return;
    }

    try {
      // Determine if first paper exists
      let paperId = null;
      if (originalPapers.length > 0) {
        paperId = originalPapers[0].id;
      } else {
        // Create first paper
        const newPaper = await api.post(`/collaborations/${collab.id}/papers`, {
          title: selectedFile.name.split(".")[0],
        });
        paperId = newPaper.data.paper.id;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      // Check if first draft exists
      const filesRes = await api.get(`/papers/${paperId}/files`);
      const existingFile = filesRes.data.files[0];
      const url = existingFile
        ? `/files/${existingFile.id}/upload-version`
        : `/papers/${paperId}/files`;

      const res = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message || "File uploaded successfully!");
      setShowUploadModal(false);
      setSelectedFile(null);
      fetchPapers();
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Upload failed.");
    }
  };

  if (loading) return <p>Loading collaboration details...</p>;

  const hasPaper = originalPapers.length > 0;

  return (
    <div className="collab-detail">
      <button className="btn btn-outline" onClick={onBack}>
        ← Back
      </button>

      <h2>{collab.title}</h2>
      <p>{collab.description}</p>
      <p>
        Members:{" "}
        {collab.members?.length > 0
          ? collab.members.map((m) => m.user?.first_name).join(", ")
          : "No members"}
      </p>

      {canUpload && (
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowUploadModal(true)}
          >
            {hasPaper ? "+ Upload New Version" : "+ Upload First Draft"}
          </button>
        </div>
      )}

      {/* Papers / Versions List */}
      <div className="papers-list">
        {papers.length === 0 && <p>No papers uploaded yet.</p>}
        {papers.map((v) => (
          <div
            key={v.id}
            className="paper-card"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedVersion(v);
              setShowPdfViewer(true);
            }}
          >
            <h4>{`V${v.version_number} - ${v.title}`}</h4>
            <p>Date: {new Date(v.created_at).toLocaleString()}</p>
            <p>Status: {v.status?.toUpperCase() || "DRAFT"}</p>
            <p>
              <a href={v.pdf_url} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </p>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{hasPaper ? "Upload New Version" : "Upload First Draft"}</h3>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleUpload}>
                {hasPaper ? "Upload Version" : "Upload Draft"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {/* {showPdfViewer && selectedVersion && (
        <div className="pdf-modal-overlay">
          <div className="pdf-modal">
            <div className="pdf-modal-header">
              <h3>{selectedVersion.title}</h3>
              <button
                className="close-pdf-btn"
                onClick={() => {
                  setShowPdfViewer(false);
                  setSelectedVersion(null);
                }}
              >
                ×
              </button>
            </div>
            {selectedVersion.pdf_url ? (
              <PDFViewer
                fileUrl={selectedVersion.pdf_url}
                fileId={selectedVersion.id}
              />
            ) : (
              <p>Unable to load PDF. Try downloading directly.</p>
            )}
          </div>
        </div>
      )} */}

      {showPdfViewer && selectedVersion && (
  <div className="pdf-modal-overlay">
    <div className="pdf-modal">
      <div className="pdf-modal-header">
        <h3>{selectedVersion.title}</h3>
        <button
          className="close-pdf-btn"
          onClick={() => {
            setShowPdfViewer(false);
            setSelectedVersion(null);
          }}
        >
          ×
        </button>
      </div>

      {selectedVersion.id ? (
        // Always pass fileId to stream the PDF securely
        <PDFViewer fileId={selectedVersion.id} />
      ) : (
        <p>Unable to load PDF. Try downloading directly.</p>
      )}
    </div>
  </div>
)}

    </div>
  );
}
