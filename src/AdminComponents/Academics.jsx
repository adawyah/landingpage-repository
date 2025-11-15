import React, { useState } from "react";
import Program from "./Program";
import Department from "./DepartmentCollege";
import "./Department.css"; // reuse same CSS

export default function Academics() {
  const [activePage, setActivePage] = useState("program"); // default view

  return (
    <div className="college-management-container">
      {/* Navigation buttons */}
      <div className="nav-buttons">
        <button
          onClick={() => setActivePage("program")}
          className={activePage === "program" ? "btn-tab-active" : "btn-tab"}
        >
          Programs
        </button>
        <button
          onClick={() => setActivePage("department")}
          className={activePage === "department" ? "btn-tab-active" : "btn-tab"}
        >
          Departments
        </button>
      </div>

      {/* Content view */}
      <div className="content-view">
        {activePage === "program" ? <Program /> : <Department />}
      </div>
    </div>
  );
}
