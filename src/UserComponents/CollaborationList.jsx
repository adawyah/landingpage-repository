// // CollaborationList.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CreateCollaborationForm from "./CreateCollaborationForm";
// import ProponentRequestForm from "./ProponentRequestForm";
// import AdvisorRequestForm from "./AdvisorRequestForm";

// export default function CollaborationList({ onOpen }) {
//   const [collaborations, setCollaborations] = useState([]);
//   const [isProponent, setIsProponent] = useState(false);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [showForm, setShowForm] = useState(null);

//   // === Fetch logged-in user automatically ===
//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await axios.get("/me");
//         const user = res.data.user ?? res.data;
//         const roles = user.roles || [];
//         setIsProponent(
//           user.is_proponent === true ||
//             (Array.isArray(roles) &&
//               (roles.includes("proponent") ||
//                 roles.some((r) => r?.name === "proponent")))
//         );
//       } catch (err) {
//         console.error("Failed to fetch user:", err.message);
//       }
//     }
//     fetchUser();
//   }, []);

//   // === Fetch collaborations automatically ===
//   useEffect(() => {
//     async function fetchCollabs() {
//       try {
//         const res = await axios.get("/collaborations");
//         setCollaborations(res.data);
//       } catch (err) {
//         console.error("Failed to fetch collaborations:", err.message);
//       }
//     }
//     fetchCollabs();
//   }, []);

//   return (
//     <div className="collaboration-container">
//       <h1 className="collaboration-title">Collaboration Portal</h1>

//       {/* Buttons */}
//       <div className="button-group">
//         <button
//           className="btn btn-primary"
//           disabled={!isProponent}
//           onClick={() => setShowCreateForm(true)}
//         >
//           Create Collaboration
//         </button>

//         <select
//           className="btn btn-outline"
//           defaultValue=""
//           onChange={(e) => setShowForm(e.target.value)}
//         >
//           <option value="" disabled>
//             Request As
//           </option>
//           <option value="proponent">Proponent</option>
//           <option value="advisor">Advisor</option>
//         </select>
//       </div>

//       {showForm === "proponent" && (
//         <ProponentRequestForm onClose={() => setShowForm(null)} />
//       )}
//       {showForm === "advisor" && (
//         <AdvisorRequestForm onClose={() => setShowForm(null)} />
//       )}
//       {showCreateForm && (
//         <CreateCollaborationForm
//           onClose={() => setShowCreateForm(false)}
//           onCreated={(collab) =>
//             setCollaborations([...collaborations, collab])
//           }
//         />
//       )}

//       {/* Collaboration cards */}
//       <div className="collab-list">
//         {collaborations.map((c) => (
//           <div
//             key={c.id}
//             className="collab-card"
//             onClick={() => onOpen(c)}
//           >
//             <h3>{c.title}</h3>
//             <p>{c.description}</p>
//             <small>
//               Advisor: {c.advisor?.user?.first_name} {c.advisor?.user?.last_name}
//             </small>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateCollaborationForm from "./CreateCollaborationForm";
import ProponentRequestForm from "./ProponentRequestForm";
import AdvisorRequestForm from "./AdvisorRequestForm";

export default function CollaborationList({ onOpen }) {
  const [collaborations, setCollaborations] = useState([]);
  const [user, setUser] = useState(null);
  const [isProponent, setIsProponent] = useState(false);
  const [isUserInCollab, setIsUserInCollab] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showForm, setShowForm] = useState(null);

  // Fetch logged-in user info
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/me");
        const u = res.data.user ?? res.data;
        setUser(u);

        const roles = u.roles || [];
        // Only approved proponents
        setIsProponent(
          Array.isArray(roles) &&
          (roles.includes("proponent") || roles.some(r => r?.name === "proponent"))
        );

      } catch (err) {
        console.error("Failed to fetch user:", err.message);
      }
    }
    fetchUser();
  }, []);

  // Fetch collaborations
  useEffect(() => {
    async function fetchCollabs() {
      try {
        const res = await axios.get("/collaborations");
        setCollaborations(res.data);
        setIsUserInCollab(res.data.length > 0);
      } catch (err) {
        console.error("Failed to fetch collaborations:", err.message);
      }
    }
    fetchCollabs();
  }, []);

  return (
    <div className="collaboration-container">
      <h1 className="collaboration-title">Collaboration Portal</h1>

      {/* Buttons always visible */}
      <div className="button-group">
        <button
          className="btn btn-primary"
          disabled={!isProponent} // enabled only if user is approved proponent
          onClick={() => setShowCreateForm(true)}
        >
          Create Collaboration
        </button>

        <select
          className="btn btn-outline"
          defaultValue=""
          onChange={(e) => setShowForm(e.target.value)}
        >
          <option value="" disabled>
            Request As
          </option>
          <option value="proponent">Proponent</option>
          <option value="advisor">Advisor</option>
        </select>
      </div>

      {/* Show role request forms */}
      {showForm === "proponent" && (
        <ProponentRequestForm onClose={() => setShowForm(null)} />
      )}
      {showForm === "advisor" && (
        <AdvisorRequestForm onClose={() => setShowForm(null)} />
      )}

      {/* Show create collaboration form */}
      {showCreateForm && (
        <CreateCollaborationForm
          onClose={() => setShowCreateForm(false)}
          onCreated={(collab) =>
            setCollaborations([...collaborations, collab])
          }
        />
      )}

      {/* Show collaborations only if user is part of any */}
      {isUserInCollab && (
        <div className="collab-list">
          {collaborations.map((c) => (
            <div
              key={c.id}
              className="collab-card"
              onClick={() => onOpen(c)}
            >
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <small>
                Advisor: {c.advisor?.user?.first_name} {c.advisor?.user?.last_name}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
