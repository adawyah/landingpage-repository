import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, X, ChevronUp, ChevronDown, Search } from "lucide-react";
import "./Department.css";

export default function Department() {
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [query, setQuery] = useState("");

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/department-colleges");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const openModal = (dept = null) => {
    setCurrentDept(dept);
    setForm(dept ? { name: dept.name } : { name: "" });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      setCurrentDept(null);
      setForm({ name: "" });
      setError("");
    }, 300);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentDept) await axios.put(`/department-colleges/${currentDept.id}`, form);
      else await axios.post("/department-colleges", form);
      fetchDepartments();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`Delete department "${dept.name}"?`)) return;
    try {
      await axios.delete(`/department-colleges/${dept.id}`);
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortConfig.key] || "";
    const bVal = b[sortConfig.key] || "";
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(query);
  };

  return (
    <div className="department-container">
      <header className="department-header">
        <h1>Departments</h1>
        <button className="btn-add" onClick={() => openModal()}><Plus size={16}/> Add Department</button>
      </header>

      <form className="search-bar" onSubmit={handleSearch}>
        <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" className="btn-search"><Search size={16} /></button>
      </form>

      <table className="department-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("name")}>
              Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? <ChevronUp size={12}/> : <ChevronDown size={12}/>) : null}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(dept => (
            <tr key={dept.id}>
              <td>{dept.name}</td>
              <td>
                <button className="btn-edit" onClick={() => openModal(dept)}><Edit2 size={16}/></button>
                <button className="btn-delete" onClick={() => handleDelete(dept)}><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className={`modal-overlay ${modalClosing ? "fade-out" : "fade-in"}`}>
          <div className={`modal ${modalClosing ? "scale-out" : "scale-in"}`}>
            <header className="modal-header">
              <h2>{currentDept ? "Edit Department" : "Add Department"}</h2>
              <button className="btn-close" onClick={closeModal}><X size={18}/></button>
            </header>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              {error && <p className="error">{error}</p>}
              <div className="modal-actions">
                <button type="submit" className="btn-save">{currentDept ? "Update" : "Save"}</button>
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
