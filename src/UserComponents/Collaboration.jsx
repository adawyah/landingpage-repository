// Collaboration.jsx
// import React, { useState } from "react";
// import CollaborationList from "./CollaborationList";
// import CollaborationDetail from "./CollaborationDetail";

// export default function Collaboration() {
//   const [selectedCollab, setSelectedCollab] = useState(null);

//   // Conditional rendering: show list or detail
//   if (selectedCollab) {
//     return (
//       <CollaborationDetail
//         collab={selectedCollab}
//         onBack={() => setSelectedCollab(null)}
//       />
//     );
//   }

//   return <CollaborationList onOpen={setSelectedCollab} />;
// }

// Collaboration.jsx
import React, { useState } from "react";
import ProponentRequestForm from "./ProponentRequestForm";
import AdvisorRequestForm from "./AdvisorRequestForm";
import ResearchCoordinatorRequestForm from "./ResearchCoordinatorRequestForm";

export default function Collaboration() {
  const [showRoleForm, setShowRoleForm] = useState(null);

  return (
    <div className="collaboration-container">
      <h1 className="collaboration-title">Collaboration Portal</h1>

      <div className="button-group">
        {/* Disabled button for visitors */}
        <button className="btn btn-primary" disabled>
          Create Collaboration
        </button>

        {/* Request role dropdown */}
        <select
          className="btn btn-outline"
          defaultValue=""
          onChange={(e) => setShowRoleForm(e.target.value)}
        >
          <option value="" disabled>
            Request As
          </option>
          <option value="proponent">Proponent</option>
          <option value="advisor">Advisor</option>
          <option value="research_coordinator">Research Coordinator</option>
        </select>
      </div>

      {showRoleForm === "proponent" && (
        <ProponentRequestForm onClose={() => setShowRoleForm(null)} />
      )}

      {showRoleForm === "advisor" && (
        <AdvisorRequestForm onClose={() => setShowRoleForm(null)} />
      )}

      {showRoleForm === "research_coordinator" && (
        <ResearchCoordinatorRequestForm onClose={() => setShowRoleForm(null)} />
      )}

      <p className="no-collab-text">
        You currently have no collaborations. Request a role to create or join
        collaborations.
      </p>
    </div>
  );
}


// // write condition if the user is included in the collaboration, he can see the
// //  list of collboration and collaboration list, else if no he can only see 
// the two button "create collaboration" and ""request as", the user has
// disables button "create collaboration" unless he has requested or is Proponent.


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CreateCollaborationForm from "./CreateCollaborationForm";
// import ProponentRequestForm from "./ProponentRequestForm";
// import AdvisorRequestForm from "./AdvisorRequestForm";

// import ConfirmModal from "./ConfirmModal";

// export default function Collaboration() {
//   const [isProponent, setIsProponent] = useState(false);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [showForm, setShowForm] = useState(null);

//   const [collaborations, setCollaborations] = useState([]);
//   const [selectedCollab, setSelectedCollab] = useState(null);
//   const [papers, setPapers] = useState([]);



//   const [confirmAction, setConfirmAction] = useState(null);
//   const [confirmMessage, setConfirmMessage] = useState("");

//   // Open confirmation
//   const askConfirm = (message, action) => {
//     setConfirmMessage(message);
//     setConfirmAction(() => action);
//   };



//   // === Fetch logged-in user ===
//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await axios.get("/me");
//         const user = res.data.user ?? res.data;
//         const roles = user.roles || [];
//         const hasProponent =
//           user.is_proponent === true ||
//           (Array.isArray(roles) &&
//             (roles.includes("proponent") ||
//               roles.some((r) => r?.name === "proponent")));
//         setIsProponent(hasProponent);
//       } catch (err) {
//         console.error("Failed to fetch user:", err.response?.data || err.message);
//       }
//     }
//     fetchUser();
//   }, []);

//   // === Fetch collaborations ===
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

//   // === Open a collaboration → load papers with files ===
//   // const openCollaboration = async (collab) => {
//   //   setSelectedCollab(collab);
//   //   try {
//   //     const res = await axios.get(`/collaborations/${collab.id}/papers`);
//   //     const papersData = await Promise.all(
//   //       res.data.map(async (p) => {
//   //         const filesRes = await axios.get(`/papers/${p.id}/files`);
//   //         return { ...p, files: filesRes.data.files };
//   //       })
//   //     );
//   //     setPapers(papersData);
//   //   } catch (err) {
//   //     console.error("Failed to load papers:", err.message);
//   //   }
//   // };

//   const openCollaboration = async (collab) => {
//   setSelectedCollab(collab);
//   try {
//     const res = await axios.get(`/collaborations/${collab.id}/papers`);
//     const papersData = await Promise.all(
//       res.data.map(async (p) => {
//         const filesRes = await axios.get(`/papers/${p.id}/files`);
//         return { ...p, files: filesRes.data.files };
//       })
//     );
//     setPapers(papersData);
//   } catch (err) {
//     console.error("Failed to load papers:", err.message);
//   }
// };


//   // === Create paper with default title (no manual input) ===
//   // const createPaper = async () => {
//   //   try {
//   //     const defaultTitle = `Paper ${papers.length + 1}`;
//   //     const res = await axios.post(`/collaborations/${selectedCollab.id}/papers`, {
//   //       title: defaultTitle,
//   //     });
//   //     setPapers([...papers, { ...res.data, files: [] }]);
//   //   } catch (err) {
//   //     console.error("Failed to create paper:", err.message);
//   //   }
//   // };

//   // === Create paper ===
//   const createPaper = () => {
//     askConfirm("Are you sure you want to create a new paper?", async () => {
//       try {
//         const defaultTitle = `Paper ${papers.length + 1}`;
//         const res = await axios.post(
//           `/collaborations/${selectedCollab.id}/papers`,
//           { title: defaultTitle }
//         );
//         setPapers([...papers, { ...res.data, files: [] }]);
//         alert("Paper created successfully.");
//       } catch (err) {
//         console.error("Failed to create paper:", err.message);
//       }
//     });
//   };

//   // === Upload file & refresh file list ===
//   // const uploadFile = async (paperId, file) => {
//   //   const formData = new FormData();
//   //   formData.append("file", file);

//   //   try {
//   //     await axios.post(`/papers/${paperId}/files`, formData, {
//   //       headers: { "Content-Type": "multipart/form-data" },
//   //     });

//   //     const res = await axios.get(`/papers/${paperId}/files`);
//   //     setPapers(
//   //       papers.map((p) =>
//   //         p.id === paperId ? { ...p, files: res.data.files } : p
//   //       )
//   //     );
//   //   } catch (err) {
//   //     console.error("File upload failed:", err.message);
//   //   }
//   // };

//   // === Upload file ===
//   const uploadFile = async (paperId, file) => {
//   if (!file) return;

//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     await axios.post(`/papers/${paperId}/files`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     const res = await axios.get(`/papers/${paperId}/files`);
//     setPapers(
//       papers.map((p) =>
//         p.id === paperId ? { ...p, files: res.data.files } : p
//       )
//     );
//     alert("File uploaded successfully.");
//   } catch (err) {
//     console.error("File upload failed:", err.message);
//   }
// };


//   // === DETAIL VIEW ===
//   if (selectedCollab) {
//     return (
//       <div className="collab-detail">
//         <button className="btn btn-outline" onClick={() => setSelectedCollab(null)}>
//           ← Back to Collaborations
//         </button>

//         <div className="detail-header">
//           <h2 className="detail-title">{selectedCollab.title}</h2>
//           <p className="detail-desc">{selectedCollab.description}</p>
//         </div>

//         <div className="detail-section">
//           <h3>Advisor</h3>
//           <p className="advisor-name">
//             {selectedCollab.advisor?.user?.first_name}{" "}
//             {selectedCollab.advisor?.user?.last_name}
//           </p>
//         </div>

//         <div className="detail-section">
//           <h3>Members</h3>
//           <div className="member-chips">
//             {selectedCollab.members.map((m) => (
//               <span key={m.id} className="chip">
//                 {m.user.first_name} {m.user.last_name}
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="detail-section">
//           <h3>Research Papers</h3>
//           <button className="btn btn-primary" onClick={createPaper}>
//             + Add New Paper
//           </button>

//           <div className="papers-grid">
//             {papers.map((p, idx) => (
//               <div key={p.id} className="paper-card">
//                 <h4>{p.title || `Paper ${idx + 1}`}</h4>
//                 <p className="status">Status: {p.status}</p>

//                 <div className="upload-box">
//                   <label className="upload-label">
//                     Upload new version:
//                     <input
//                       type="file"
//                       onChange={(e) => uploadFile(p.id, e.target.files[0])}
//                     />
//                   </label>
//                 </div>

//                 <h5>Version History</h5>
//                 {p.files && p.files.length > 0 ? (
//                   <ul className="version-list">
//                     {p.files.map((f) => (
//                       <li key={f.id}>
//                         <strong>v{f.version}</strong> —{" "}
//                         <a href={f.url} target="_blank" rel="noopener noreferrer">
//                           {f.file_path.split("/").pop()}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="no-files">No files uploaded yet.</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // === LIST OF ALL COLLABORATIONS ===
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
//             onClick={() => openCollaboration(c)}
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











// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CreateCollaborationForm from "./CreateCollaborationForm";
// import ProponentRequestForm from "./ProponentRequestForm";
// import AdvisorRequestForm from "./AdvisorRequestForm";

// export default function Collaboration() {
//   const [isProponent, setIsProponent] = useState(false);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [showForm, setShowForm] = useState(null);

//   const [collaborations, setCollaborations] = useState([]);
//   const [selectedCollab, setSelectedCollab] = useState(null);
//   const [papers, setPapers] = useState([]);
//   const [newPaper, setNewPaper] = useState("");

//   // Fetch logged-in user
//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await axios.get("/me");
//         const user = res.data.user ?? res.data;
//         const roles = user.roles || [];
//         const hasProponent =
//           user.is_proponent === true ||
//           (Array.isArray(roles) &&
//             (roles.includes("proponent") ||
//               roles.some((r) => r?.name === "proponent")));
//         setIsProponent(hasProponent);
//       } catch (err) {
//         console.error("Failed to fetch user:", err.response?.data || err.message);
//       }
//     }
//     fetchUser();
//   }, []);

//   // Fetch collaborations
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

//   // Open a collaboration → load papers with files
//   const openCollaboration = async (collab) => {
//     setSelectedCollab(collab);
//     try {
//       const res = await axios.get(`/collaborations/${collab.id}/papers`);
//       const papersData = await Promise.all(
//         res.data.map(async (p) => {
//           const filesRes = await axios.get(`/papers/${p.id}/files`);
//           return { ...p, files: filesRes.data.files };
//         })
//       );
//       setPapers(papersData);
//     } catch (err) {
//       console.error("Failed to load papers:", err.message);
//     }
//   };

//   // const createPaper = async () => {
//   //   if (!newPaper) return;
//   //   try {
//   //     const res = await axios.post(`/collaborations/${selectedCollab.id}/papers`, {
//   //       title: newPaper,
//   //     });
//   //     setPapers([...papers, { ...res.data, files: [] }]);
//   //     setNewPaper("");
//   //   } catch (err) {
//   //     console.error("Failed to create paper:", err.message);
//   //   }
//   // };
//   const createPaper = async () => {
//   try {
//     const defaultTitle = `Paper ${papers.length + 1}`;
//     const res = await axios.post(`/collaborations/${selectedCollab.id}/papers`, {
//       title: defaultTitle,
//     });
//     setPapers([...papers, { ...res.data, files: [] }]);
//   } catch (err) {
//     console.error("Failed to create paper:", err.message);
//   }
// };


//   const uploadFile = async (paperId, file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await axios.post(`/papers/${paperId}/files`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // refresh file list
//       const res = await axios.get(`/papers/${paperId}/files`);
//       setPapers(
//         papers.map((p) =>
//           p.id === paperId ? { ...p, files: res.data.files } : p
//         )
//       );
//     } catch (err) {
//       console.error("File upload failed:", err.message);
//     }
//   };

//   // === DETAIL VIEW ===
// if (selectedCollab) {
//   return (
//     <div className="collab-detail">
//       <button className="btn btn-outline" onClick={() => setSelectedCollab(null)}>
//         ← Back to Collaborations
//       </button>

//       <div className="detail-header">
//         <h2 className="detail-title">{selectedCollab.title}</h2>
//         <p className="detail-desc">{selectedCollab.description}</p>
//       </div>

//       <div className="detail-section">
//         <h3>Advisor</h3>
//         <p className="advisor-name">
//           {selectedCollab.advisor?.user?.first_name}{" "}
//           {selectedCollab.advisor?.user?.last_name}
//         </p>
//       </div>

//       <div className="detail-section">
//         <h3>Members</h3>
//         <div className="member-chips">
//           {selectedCollab.members.map((m) => (
//             <span key={m.id} className="chip">
//               {m.user.first_name} {m.user.last_name}
//             </span>
//           ))}
//         </div>
//       </div>

      
// {/* 
//       <div className="detail-section">
//         <h3>Research Papers</h3>
//         <div className="new-paper-form">
//           <input
//             type="text"
//             placeholder="Enter new paper title"
//             value={newPaper}
//             onChange={(e) => setNewPaper(e.target.value)}
//           />
//           <button className="btn btn-primary" onClick={createPaper}>
//             + Add Paper
//           </button>
//         </div> */}

//         {/* <div className="papers-grid">
//           {papers.map((p) => (
//             <div key={p.id} className="paper-card">
//               <h4>{p.title}</h4>
//               <p className="status">Status: {p.status}</p>

//               <div className="upload-box">
//                 <label className="upload-label">
//                   Upload new version:
//                   <input
//                     type="file"
//                     onChange={(e) => uploadFile(p.id, e.target.files[0])}
//                   />
//                 </label>
//               </div> */}

//               {/* <h5>Version History</h5> */}
//               {/* {p.files && p.files.length > 0 ? (
//                 <ul className="version-list">
//                   {p.files.map((f) => (
//                     <li key={f.id}>
//                       <strong>v{f.version}</strong> —{" "}
//                       <a href={f.url} target="_blank" rel="noopener noreferrer">
//                         {f.file_path.split("/").pop()}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="no-files">No files uploaded yet.</p>
//               )} */}
//             {/* </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }  */}




// <div className="detail-section">
//   <h3>Research Papers</h3>

//   <button className="btn btn-primary" onClick={createPaper}>
//     + Add New Paper
//   </button>

//   <div className="papers-grid">
//     {papers.map((p, idx) => (
//       <div key={p.id} className="paper-card">
//         <h4>{p.title || `Paper ${idx + 1}`}</h4>
//         <p className="status">Status: {p.status}</p>

//         <div className="upload-box">
//           <label className="upload-label">
//             Upload new version:
//             <input
//               type="file"
//               onChange={(e) => uploadFile(p.id, e.target.files[0])}
//             />
//           </label>
//         </div>

//         <h5>Version History</h5>
//         {p.files && p.files.length > 0 ? (
//           <ul className="version-list">
//             {p.files.map((f) => (
//               <li key={f.id}>
//                 <strong>v{f.version}</strong> —{" "}
//                 <a href={f.url} target="_blank" rel="noopener noreferrer">
//                   {f.file_path.split("/").pop()}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="no-files">No files uploaded yet.</p>
//         )}
//       </div>
//     ))}
//   </div>
// </div>



//   // === LIST OF ALL COLLABORATIONS ===
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
//           <div key={c.id} className="collab-card" onClick={() => openCollaboration(c)}>
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
