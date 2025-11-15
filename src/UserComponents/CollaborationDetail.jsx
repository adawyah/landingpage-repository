
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./CollabDetail.css"; // Updated CSS import

// export default function CollaborationDetail({ collab, onBack }) {
//   const [papers, setPapers] = useState([]);

//   // Fetch papers automatically
//   useEffect(() => {
//     async function fetchPapers() {
//       try {
//         const res = await axios.get(`/collaborations/${collab.id}/papers`);
//         const papersData = await Promise.all(
//           res.data.map(async (p) => {
//             const filesRes = await axios.get(`/papers/${p.id}/files`);
//             return { ...p, files: filesRes.data.files };
//           })
//         );
//         setPapers(papersData);
//       } catch (err) {
//         console.error("Failed to load papers:", err.message);
//       }
//     }
//     fetchPapers();
//   }, [collab.id]);

//   // Create new paper
//   const createPaper = async () => {
//     try {
//       const defaultTitle = `Paper ${papers.length + 1}`;
//       const res = await axios.post(
//         `/collaborations/${collab.id}/papers`,
//         { title: defaultTitle }
//       );
//       setPapers([...papers, { ...res.data, files: [] }]);
//     } catch (err) {
//       console.error("Failed to create paper:", err.message);
//     }
//   };

//   // Upload new version
//   const uploadFile = async (paperId, file) => {
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       await axios.post(`/papers/${paperId}/files`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
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

//   return (
//     <div className="collab-detail">
//       <button className="btn btn-outline" onClick={onBack}>
//         ← Back to Collaborations
//       </button>



//       <div className="detail-header">
//   {/* Left color strip */}
//   <div className="header-strip"></div>

//   {/* Text content */}
//   <div className="header-content">
//     <h2 className="research-title">{collab.title}</h2>
//     <p className="research-description">{collab.description}</p>
//     <p className="research-members">
//       By {collab.members.map((m) => m.user.first_name).join(", ")}
//     </p>
//     <p className="research-department">Department of Information Technology</p>
//   </div>
// </div>


//       {/* Research Papers Section */}
//       <div className="detail-section">
//         <h3>Research Papers</h3>
//         <button className="btn btn-primary" onClick={createPaper}>
//           + Add New Paper
//         </button>

//         <div className="papers-grid">
//           {papers.map((p, idx) => (
//             <div key={p.id} className="paper-card">
//               <h4>{p.title || `Paper ${idx + 1}`}</h4>
//               <p className="status">Status: {p.status}</p>

//               <div className="upload-box">
//                 <label className="upload-label">
//                   Upload new version:
//                   <input
//                     type="file"
//                     onChange={(e) => uploadFile(p.id, e.target.files[0])}
//                   />
//                 </label>
//               </div>

//               <h5>Version History</h5>
//               {p.files && p.files.length > 0 ? (
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
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


// CollaborationDetail.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CollabDetail.css";

export default function CollaborationDetail({ collab, user, onBack }) {
  const [papers, setPapers] = useState([]);

  // Check if user is a member of this collaboration
  const isMember = collab.members.some((m) => m.user.id === user.id);
  // Check if user is the advisor
  const isAdvisor = collab.advisor?.user?.id === user.id;

  // Only members or advisor can see details
  if (!isMember && !isAdvisor) {
    return (
      <div>
        <p>You do not have access to this collaboration.</p>
        <button className="btn btn-outline" onClick={onBack}>
          ← Back to Collaborations
        </button>
      </div>
    );
  }

  // Fetch papers
  useEffect(() => {
    async function fetchPapers() {
      try {
        const res = await axios.get(`/collaborations/${collab.id}/papers`);
        const papersData = await Promise.all(
          res.data.map(async (p) => {
            const filesRes = await axios.get(`/papers/${p.id}/files`);
            return { ...p, files: filesRes.data.files };
          })
        );
        setPapers(papersData);
      } catch (err) {
        console.error("Failed to load papers:", err.message);
      }
    }
    fetchPapers();
  }, [collab.id]);

  // Create new paper
  const createPaper = async () => {
    try {
      const defaultTitle = `Paper ${papers.length + 1}`;
      const res = await axios.post(`/collaborations/${collab.id}/papers`, {
        title: defaultTitle,
      });
      setPapers([...papers, { ...res.data, files: [] }]);
    } catch (err) {
      console.error("Failed to create paper:", err.message);
    }
  };

  // Upload new version
  const uploadFile = async (paperId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`/papers/${paperId}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const res = await axios.get(`/papers/${paperId}/files`);
      setPapers(
        papers.map((p) => (p.id === paperId ? { ...p, files: res.data.files } : p))
      );
    } catch (err) {
      console.error("File upload failed:", err.message);
    }
  };

  return (
    <div className="collab-detail">
      <button className="btn btn-outline" onClick={onBack}>
        ← Back to Collaborations
      </button>

      <div className="detail-header">
        <div className="header-strip"></div>
        <div className="header-content">
          <h2 className="research-title">{collab.title}</h2>
          <p className="research-description">{collab.description}</p>
          <p className="research-members">
            By {collab.members.map((m) => m.user.first_name).join(", ")}
          </p>
          <p className="research-department">Department of Information Technology</p>
        </div>
      </div>

      <div className="detail-section">
        <h3>Research Papers</h3>

        {/* Only members can create papers */}
        {isMember && (
          <button className="btn btn-primary" onClick={createPaper}>
            + Add New Paper
          </button>
        )}

        <div className="papers-grid">
          {papers.map((p, idx) => (
            <div key={p.id} className="paper-card">
              <h4>{p.title || `Paper ${idx + 1}`}</h4>
              <p className="status">Status: {p.status}</p>

              {/* Only members can upload files */}
              {isMember && (
                <div className="upload-box">
                  <label className="upload-label">
                    Upload new version:
                    <input
                      type="file"
                      onChange={(e) => uploadFile(p.id, e.target.files[0])}
                    />
                  </label>
                </div>
              )}

              <h5>Version History</h5>
              {p.files && p.files.length > 0 ? (
                <ul className="version-list">
                  {p.files.map((f) => (
                    <li key={f.id}>
                      <strong>v{f.version}</strong> —{" "}
                      <a href={f.url} target="_blank" rel="noopener noreferrer">
                        {f.file_path.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-files">No files uploaded yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
