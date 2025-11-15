import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, X, ChevronUp, ChevronDown, Search } from "lucide-react";
import "./Department.css"; // reuse same style

export default function Program() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [form, setForm] = useState({ name: "", abbreviation: "", departmentcollege_id: "" });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [query, setQuery] = useState("");

  const fetchPrograms = async () => {
    try {
      const res = await axios.get("/program-colleges");
      setPrograms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/department-colleges");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchDepartments();
  }, []);

  const openModal = (program = null) => {
    setCurrentProgram(program);
    setForm(
      program
        ? {
            name: program.name,
            abbreviation: program.abbreviation || "",
            departmentcollege_id: program.departmentcollege_id || "",
          }
        : { name: "", abbreviation: "", departmentcollege_id: "" }
    );
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      setCurrentProgram(null);
      setForm({ name: "", abbreviation: "", departmentcollege_id: "" });
      setError("");
    }, 300);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProgram)
        await axios.put(`/program-colleges/${currentProgram.id}`, form);
      else
        await axios.post("/program-colleges", form);
      fetchPrograms();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (program) => {
    if (!window.confirm(`Delete program "${program.name}"?`)) return;
    try {
      await axios.delete(`/program-colleges/${program.id}`);
      fetchPrograms();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filtered = programs.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.abbreviation || "").toLowerCase().includes(search.toLowerCase())
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
        <h1>Programs</h1>
        <button className="btn-add" onClick={() => openModal()}><Plus size={16}/> Add Program</button>
      </header>

      <form className="search-bar" onSubmit={handleSearch}>
        <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" className="btn-search"><Search size={16}/></button>
      </form>

      <table className="department-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("name")}>
              Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? <ChevronUp size={12}/> : <ChevronDown size={12}/>) : null}
            </th>
            <th>Abbreviation</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(program => (
            <tr key={program.id}>
              <td>{program.name}</td>
              <td>{program.abbreviation || "-"}</td>
              <td>{program.department_college?.name || "-"}</td>
              <td>
                <button className="btn-edit" onClick={() => openModal(program)}><Edit2 size={16}/></button>
                <button className="btn-delete" onClick={() => handleDelete(program)}><Trash2 size={16}/></button>
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
              <h2>{currentProgram ? "Edit Program" : "Add Program"}</h2>
              <button className="btn-close" onClick={closeModal}><X size={18}/></button>
            </header>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Abbreviation</label>
                <input name="abbreviation" value={form.abbreviation} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select name="departmentcollege_id" value={form.departmentcollege_id} onChange={handleChange} required>
                  <option value="">-- Select Department --</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              {error && <p className="error">{error}</p>}
              <div className="modal-actions">
                <button type="submit" className="btn-save">{currentProgram ? "Update" : "Save"}</button>
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
