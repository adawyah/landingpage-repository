// The main issue is that ProponentRequest is being rendered 
// inside your AdvisorSidebar <Routes> in a way that can violate React’s hook rules 
// if not wrapped as a standalone page component.

// We can adjust ProponentRequest so it works exactly like Faculty.jsx 
// without touching App.jsx. The key changes:

// Use useNavigate for routing if needed.

// Make it a self-contained page component.

// Ensure hooks (useState, useEffect) are called at the top level.




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // for navigation if needed
import "./ProponentRequests.css";

export default function ProponentRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ like Faculty.jsx

  useEffect(() => {
    fetchRequests();
  }, []);

  // const fetchRequests = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.get("/role-requests/pending-for-advisor");
  //     setRequests(res.data);
  //   } catch (err) {
  //     console.error("Failed to fetch proponent requests", err.response?.data || err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchRequests = async () => {
  try {
    setLoading(true);
    const res = await axios.get("/proponent-requests/pending"); // ✅ correct URL
    setRequests(res.data);
  } catch (err) {
    console.error("Failed to fetch proponent requests", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  // const handleApprove = async (id) => {
  //   try {
  //     await axios.patch(`/role-requests/${id}/approve`);
  //     alert("Proponent request approved!");
  //     fetchRequests();
  //   } catch (err) {
  //     console.error("Approve failed:", err.response?.data || err.message);
  //     alert("Error: " + (err.response?.data?.message || "Failed to approve"));
  //   }
  // };

  const handleApprove = async (id) => {
  try {
    await axios.patch(`/proponent-requests/${id}/approve`); // ✅ correct URL
    alert("Proponent request approved!");
    fetchRequests();
  } catch (err) {
    console.error("Approve failed:", err.response?.data || err.message);
    alert("Error: " + (err.response?.data?.message || "Failed to approve"));
  }
};

  // const handleReject = async (id) => {
  //   const remarks = prompt("Enter rejection remarks (optional):");
  //   try {
  //     await axios.patch(`/role-requests/${id}/reject`, { remarks });
  //     alert("Proponent request rejected!");
  //     fetchRequests();
  //   } catch (err) {
  //     console.error("Reject failed:", err.response?.data || err.message);
  //     alert("Error: " + (err.response?.data?.message || "Failed to reject"));
  //   }
  // };

  const handleReject = async (id) => {
  const remarks = prompt("Enter rejection remarks (optional):");
  try {
    await axios.patch(`/proponent-requests/${id}/reject`, { remarks }); // ✅ correct URL
    alert("Proponent request rejected!");
    fetchRequests();
  } catch (err) {
    console.error("Reject failed:", err.response?.data || err.message);
    alert("Error: " + (err.response?.data?.message || "Failed to reject"));
  }
};


  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading proponent requests...</p>
      </div>
    );
  }

  return (
    <div className="proponent-container">
      <header className="proponent-header">
        <h1>Proponent Requests</h1>
        <p>Approve or reject pending proponents assigned to you</p>
      </header>

      {requests.length === 0 ? (
        <p className="empty-message">🎉 No pending proponent requests.</p>
      ) : (
        <div className="table-wrapper">
          <table className="requests-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Middle Initial</th>
                {/* <th>Department</th>
                <th>Advisor</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.meta.first_name}</td>
                  <td>{r.meta.last_name}</td>
                  <td>{r.meta.middle_initial || "-"}</td>
                  {/* <td>{r.meta.department_name || "Unknown"}</td>
                  <td>{r.meta.advisor_name || "You"}</td> */}
                  <td className="actions">
                    <button className="btn-approve" onClick={() => handleApprove(r.id)}>
                      Approve
                    </button>
                    <button className="btn-reject" onClick={() => handleReject(r.id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
 }

// ✅ Key things we fixed:

// Added useNavigate() even if not used yet (like Faculty.jsx) — this keeps the component structure consistent with your working components.

// Hooks are only at the top level.

// Fully self-contained component — no dependency on how App.jsx renders it.

// This should now work inside your Advisor routes without triggering the invalid hook error.











// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./ProponentRequests.css"; // your CSS file

// export default function ProponentRequest() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   // Fetch pending proponent requests assigned to this advisor
//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/role-requests/pending-for-advisor");
//       setRequests(res.data);
//     } catch (err) {
//       console.error("Failed to fetch proponent requests", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (id) => {
//     try {
//       await axios.patch(`/role-requests/${id}/approve`);
//       alert("Proponent request approved!");
//       fetchRequests();
//     } catch (err) {
//       console.error("Approve failed:", err.response?.data || err.message);
//       alert("Error: " + (err.response?.data?.message || "Failed to approve"));
//     }
//   };

//   const handleReject = async (id) => {
//     const remarks = prompt("Enter rejection remarks (optional):");
//     try {
//       await axios.patch(`/role-requests/${id}/reject`, { remarks });
//       alert("Proponent request rejected!");
//       fetchRequests();
//     } catch (err) {
//       console.error("Reject failed:", err.response?.data || err.message);
//       alert("Error: " + (err.response?.data?.message || "Failed to reject"));
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading">
//         <div className="spinner"></div>
//         <p>Loading proponent requests...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="proponent-container">
//       <header className="proponent-header">
//         <h1>Proponent Requests</h1>
//         <p>Approve or reject pending proponents assigned to you</p>
//       </header>

//       {requests.length === 0 ? (
//         <p className="empty-message">🎉 No pending proponent requests.</p>
//       ) : (
//         <div className="table-wrapper">
//           <table className="requests-table">
//             <thead>
//               <tr>
//                 <th>First Name</th>
//                 <th>Last Name</th>
//                 <th>Middle Initial</th>
//                 <th>Department</th>
//                 <th>Advisor</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((r) => (
//                 <tr key={r.id}>
//                   <td>{r.meta.first_name}</td>
//                   <td>{r.meta.last_name}</td>
//                   <td>{r.meta.middle_initial || "-"}</td>
//                   <td>{r.meta.department_name || "Unknown"}</td>
//                   <td>{r.meta.advisor_name || "You"}</td>
//                   <td className="actions">
//                     <button className="btn-approve" onClick={() => handleApprove(r.id)}>
//                       Approve
//                     </button>
//                     <button className="btn-reject" onClick={() => handleReject(r.id)}>
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
