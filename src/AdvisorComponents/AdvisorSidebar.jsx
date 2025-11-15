import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaSearch, FaHeart, FaBookReader, FaQuoteRight } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { GrDocumentUpload } from "react-icons/gr";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { TbWorld } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";

import TopSection from "./TopSection";
import Logo from "../assets/Logo1.png";
import "./sidebar.css";

export default function AdvisorSidebar({ onLogout, children, user }) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { path: "/advisor/dashboard", name: "Search", icon: <FaSearch /> },
    { path: "/advisor/profile", name: "Profile", icon: <ImProfile /> },
      { path: "/advisor/proponent", name: "Proponent", icon: <FaUsers /> },
    { path: "/advisor/CollaborationAdvisor", name: "Collaboration", icon: <GrDocumentUpload /> },
    { path: "/advisor/favorite", name: "Favorite", icon: <FaHeart /> },
    { path: "/advisor/published", name: "Published", icon: <HiOutlineDocumentDownload /> },
    { path: "/advisor/download", name: "Download", icon: <HiOutlineDocumentDownload /> },
    { path: "/advisor/read", name: "Read", icon: <FaBookReader /> },
    { path: "/advisor/citedpaper", name: "Cited Paper", icon: <FaQuoteRight /> },
    { path: "/advisor/explore", name: "Explore", icon: <TbWorld /> },
    { path: "/advisor/setting", name: "Setting", icon: <IoSettings /> },
  ];

  return (
    <div className="admin-layout">
      <div className="sidebar" style={{ width: isOpen ? "220px" : "64px"}}>
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

      <div className="main-wrapper">
        <TopSection isOpen={isOpen} setIsOpen={() => setIsOpen(v => !v)} user={user} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
