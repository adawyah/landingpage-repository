import React from "react";
import { Calendar, Bell, Send, User } from "lucide-react";
import { FiSidebar } from "react-icons/fi";
import "./TopSection.css";

const TopSection = ({ isOpen, setIsOpen }) => {
  return (
    <div className="top-section">
      <div className="top-inner">
        {/* Left Side - Sidebar Toggle + School Info */}
        <div className="left-wrapper">
          <div className="sidebar-toggle">
            <FiSidebar
              onClick={() => setIsOpen(!isOpen)}
              style={{ transform: !isOpen && "rotate(180deg)" }}
            />
          </div>
          <div className="school-info">
            <h1 className="school-title">OPOL COMMUNITY COLLEGE</h1>
            <h2 className="school-subtitle">RESEARCH REPOSITORY & ARCHIVES</h2>
          </div>
        </div>

        {/* Right Side - Icons */}
        <div className="nav-icons">
          <div className="icon-box">
            <Calendar size={16} />
          </div>
          <div className="icon-box">
            <Bell size={16} />
          </div>
          <div className="icon-box">
            <Send size={16} />
          </div>
          <div className="icon-box">
            <User size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSection;
