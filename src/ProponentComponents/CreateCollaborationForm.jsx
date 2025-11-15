import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateCollaborationForm.css";

export default function CreateCollaborationForm({ onClose, onCreated }) {
  const [advisors, setAdvisors] = useState([]);
  const [members, setMembers] = useState([]); // search results
  const [searchMember, setSearchMember] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]); // ✅ chosen members
  const [form, setForm] = useState({
    advisor_id: "",
    title: "",
    description: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/advisors").then((res) => setAdvisors(res.data));
  }, []);

  useEffect(() => {
    if (form.advisor_id && searchMember.length > 1) {
      axios
        .get("/collaborations/members/search", { params: { q: searchMember } })
        .then((res) => setMembers(res.data));
    } else {
      setMembers([]);
    }
  }, [searchMember, form.advisor_id]);

  const handleSelectMember = (member) => {
    if (!selectedMembers.find((m) => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
    setSearchMember(""); // clear search box
    setMembers([]); // hide dropdown
  };

  const handleRemoveMember = (id) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedTitle =
        form.title.charAt(0).toUpperCase() + form.title.slice(1);

      const res = await axios.post("/collaborations", {
        advisor_id: form.advisor_id,
        title: formattedTitle,
        description: form.description,
        members: selectedMembers.map((m) => ({ id: m.id })),
      });

      onCreated(res.data);
      navigate(`/collaborations/${res.data.id}`);
    } catch (err) {
      console.error(
        "Failed to create collaboration:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>

        <h2>Create Collaboration</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Advisor Dropdown */}
          <label>Advisor</label>
          <select
            value={form.advisor_id}
            onChange={(e) => setForm({ ...form, advisor_id: e.target.value })}
            required
          >
            <option value="">Select Advisor</option>
            {advisors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.user.first_name} {a.user.last_name}
              </option>
            ))}
          </select>

          {/* Title */}
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          {/* Description */}
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Members */}
          <label>Members</label>
          <input
            type="text"
            placeholder="Search members..."
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
          />

          {/* Search dropdown */}
          {members.length > 0 && (
            <ul className="search-dropdown">
              {members.map((m) => (
                <li
                  key={m.id}
                  onClick={() => handleSelectMember(m)}
                  className="dropdown-item"
                >
                  {m.user.first_name} {m.user.last_name}
                </li>
              ))}
            </ul>
          )}

          {/* Selected members as chips */}
          <div className="selected-members">
            {selectedMembers.map((m) => (
              <div key={m.id} className="member-chip">
                {m.user.first_name} {m.user.last_name}
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveMember(m.id)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function CreateCollaborationForm({ onClose, onCreated }) {
//   const [advisors, setAdvisors] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [searchMember, setSearchMember] = useState("");
//   const [form, setForm] = useState({
//     advisor_id: "",
//     title: "",
//     description: "",
//     member_ids: []
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("/advisors").then((res) => setAdvisors(res.data));
//   }, []);

//   useEffect(() => {
//     if (form.advisor_id && searchMember.length > 1) {
//       axios
//         .get("/collaborations/members/search", { params: { q: searchMember } })
//         .then((res) => setMembers(res.data));
//     } else {
//       setMembers([]);
//     }
//   }, [searchMember, form.advisor_id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formattedTitle =
//         form.title.charAt(0).toUpperCase() + form.title.slice(1);

//       const res = await axios.post("/collaborations", {
//         advisor_id: form.advisor_id,
//         title: formattedTitle,
//         description: form.description,
//         members: form.member_ids.map((id) => ({ id }))
//       });

//       onCreated(res.data);

//       // ✅ redirect to collaboration detail page
//       navigate(`/collaborations/${res.data.id}`);
//     } catch (err) {
//       console.error("Failed to create collaboration:", err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="form-modal">
//       <h2>Create Collaboration</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Advisor Dropdown */}
//         <label>Advisor</label>
//         <select
//           value={form.advisor_id}
//           onChange={(e) => setForm({ ...form, advisor_id: e.target.value })}
//           required
//         >
//           <option value="">Select Advisor</option>
//           {advisors.map((a) => (
//             <option key={a.id} value={a.id}>
//               {a.user.first_name} {a.user.last_name}
//             </option>
//           ))}
//         </select>

//         {/* Title */}
//         <label>Title</label>
//         <input
//           type="text"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           required
//         />

//         {/* Description */}
//         <label>Description</label>
//         <textarea
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//         />

//         {/* Search & Select Members */}
//         <label>Members</label>
//         <input
//           type="text"
//           placeholder="Search members..."
//           value={searchMember}
//           onChange={(e) => setSearchMember(e.target.value)}
//         />

//         <ul>
//           {members.map((m) => (
//             <li key={m.id}>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={form.member_ids.includes(m.id)}
//                   onChange={(e) => {
//                     const newIds = e.target.checked
//                       ? [...form.member_ids, m.id]
//                       : form.member_ids.filter((id) => id !== m.id);
//                     setForm({ ...form, member_ids: newIds });
//                   }}
//                 />
//                 {m.user.first_name} {m.user.last_name}
//               </label>
//             </li>
//           ))}
//         </ul>

//         <button type="submit" className="btn btn-primary">Save</button>
//         <button type="button" className="btn btn-secondary" onClick={onClose}>
//           Cancel
//         </button>
//       </form>
//     </div>
//   );
// }
