import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaSearch, FaHeart, FaBookReader, FaQuoteRight } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { GrDocumentUpload } from "react-icons/gr";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { TbWorld } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";

import TopSection from "./TopSection";
import Logo from "../assets/Logo1.png";
import "./sidebar.css";

export default function ResearchCoordinatorSidebar({ onLogout, children, user }) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { path: "/rc/dashboard", name: "Search", icon: <FaSearch /> },
    { path: "/rc/profile", name: "Profile", icon: <ImProfile /> },
     { path: "/rc/deptadvisors", name: "Advisors", icon: <ImProfile /> },
     { path: "/rc/submissionreview", name: "Submission Review", icon: <ImProfile /> },
      { path: "/rc/departmentArchives", name: "Department Archives", icon: <ImProfile /> },
     { path: "/rc/read", name: "Read", icon: <FaBookReader /> },
      { path: "/rc/published", name: "Published", icon: <HiOutlineDocumentDownload /> },
        { path: "/rc/favorite", name: "Favorite", icon: <FaHeart /> },
          { path: "/rc/download", name: "Download", icon: <HiOutlineDocumentDownload /> },
           { path: "/rc/setting", name: "Setting", icon: <IoSettings /> },
  ];

  return (
    <div className="admin-layout">
      <div className="sidebar" style={{ width: isOpen ? "220px" : "64px" }}>
        <div className="sidebar-logo" style={{ display: isOpen ? "block" : "none" }}>
          <img src={Logo} alt="Logo" className="logo-img" />
        </div>

        {menuItems.map((item, idx) => (
          <NavLink
            to={item.path}
            key={idx}
            className={({ isActive }) => "link" + (isActive ? " active" : "")}
            style={{ marginTop: idx === 0 ? "1rem" : undefined }}
          >
            <div className="icon">{item.icon}</div>
            <div className="link-text" style={{ display: isOpen ? "block" : "none" }}>
              {item.name}
            </div>
          </NavLink>
        ))}

        <button onClick={onLogout} className="logout-btn">Logout</button>
        <button onClick={() => setIsOpen(v => !v)} style={{ margin: "1rem", padding: ".5rem" }}>
          {isOpen ? "Collapse" : "Open"}
        </button>
      </div>
{/* 
      <div className="main-wrapper">
        <TopSection isOpen={isOpen} setIsOpen={() => setIsOpen(v => !v)} />
        <main className="main-content">
          {children}
        </main>
      </div> */}

      <div className="main-wrapper">
        <TopSection isOpen={isOpen} setIsOpen={() => setIsOpen(v => !v)} user={user} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
