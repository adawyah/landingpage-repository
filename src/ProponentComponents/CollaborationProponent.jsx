import React, { useState, useEffect } from "react";
import axios from "axios";
import CollaborationDetail from "./CollaborationDetail";
import CreateCollaborationForm from "./CreateCollaborationForm";

export default function CollaborationProponent() {
  const [collaborations, setCollaborations] = useState([]);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // ✅ Only one useEffect at the top
  useEffect(() => {
    async function fetchCollabs() {
      try {
        const res = await axios.get("/collaborations");
        console.log("Fetched collaborations:", res.data);
        setCollaborations(res.data);
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
      }
    }
    fetchCollabs();
  }, []);

  // ✅ Early return AFTER all hooks
  if (selectedCollab) {
    return (
      <CollaborationDetail
        collab={selectedCollab}
        onBack={() => setSelectedCollab(null)}
        canUpload={true}
      />
    );
  }

  return (
    <div className="collaboration-container">
      <h1 className="collaboration-title">Collaboration Portal</h1>

      <button
        className="btn btn-primary"
        onClick={() => setShowCreateForm(true)}
      >
        Create Collaboration
      </button>

      {showCreateForm && (
        <CreateCollaborationForm
          onClose={() => setShowCreateForm(false)}
          onCreated={(collab) => setCollaborations([...collaborations, collab])}
        />
      )}

      <div className="collab-list">
        {collaborations.map((c) => (
          <div
            key={c.id}
            className="collab-card"
            onClick={() => setSelectedCollab(c)}
          >
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <small>
              Advisor: {c.advisor?.user?.first_name}{" "}
              {c.advisor?.user?.last_name}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
