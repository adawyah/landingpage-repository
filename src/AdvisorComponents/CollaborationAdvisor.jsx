import React, { useState, useEffect } from "react";
import axios from "axios";
import CollaborationDetail from "./CollaborationDetail";

export default function CollaborationAdvisor() {
  const [collaborations, setCollaborations] = useState([]);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await axios.get("/me");
      setUserId(res.data.user?.id);
    }
    fetchUser();
  }, []);

//   useEffect(() => {
//     async function fetchCollabs() {
//       const res = await axios.get("/collaborations");
//       // Only collaborations where advisor is this user
//       const advisorCollabs = res.data.filter(c => c.advisor?.user?.id === userId);
//       setCollaborations(advisorCollabs);
//     }
//     if (userId) fetchCollabs();
//   }, [userId]);


// CollaborationAdvisor.jsx
useEffect(() => {
  async function fetchCollabs() {
    // const res = await axios.get("/advisor/collaborations");
    const res = await axios.get("/collaborations/advisor");

    setCollaborations(res.data);
  }
  fetchCollabs();
}, []);


  if (selectedCollab) {
    return (
      <CollaborationDetail
        collab={selectedCollab}
        onBack={() => setSelectedCollab(null)}
        canUpload={false} // Advisors cannot upload
      />
    );
  }

  return (
    <div className="collaboration-container">
      <h1 className="collaboration-title">Advisor Collaboration Portal</h1>

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
              Proponents: {c.members.map(m => m.user.first_name).join(", ")}
            </small>
          </div>
        ))}

        {collaborations.length === 0 && (
          <p className="no-collab-text">You are not included in any collaboration yet.</p>
        )}
      </div>
    </div>
  );
}
