// AdminSidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// import {
//   FaClipboardList,
//   FaUpload,
// } from "react-icons/fa";

import { Building, BarChart2, Users, FileText, User,
  Clipboard, Upload
 } from "lucide-react";

import TopSection from "./TopSection";
import Logo from "../assets/Logo1.png";
import "./sidebar.css";

export default function AdminSidebar({ onLogout, children }) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { path: "/admin/analytics", name: "Analytics", icon: <BarChart2 /> },
    { path: "/admin/documents", name: "Documents", icon: <FileText /> },
    { path: "/admin/faculty", name: "Faculty", icon: <User /> },
      { path: "/admin/Academics", name: "Academics", icon: <Building /> },
    { path: "/admin/reports", name: "Reports", icon: <Clipboard /> },
    { path: "/admin/students", name: "Students", icon: <Users /> },
    { path: "/admin/uploads", name: "Uploads", icon: <Upload /> },
  ];

  return (
    <div className="admin-layout">
      <div className="sidebar" style={{ width: isOpen ? "220px" : "64px" }}>
        <div
          className="sidebar-logo"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <img src={Logo} alt="Logo" className="logo-img" />
        </div>

        {menuItems.map((item, idx) => (
          <NavLink
            to={item.path}
            key={idx}
            className={({ isActive }) =>
              "link" + (isActive ? " active" : "")
            }
            style={{ marginTop: idx === 0 ? "1rem" : undefined }}
          >
            <div className="icon">{item.icon}</div>
            <div
              className="link-text"
              style={{ display: isOpen ? "block" : "none" }}
            >
              {item.name}
            </div>
          </NavLink>
        ))}

        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>

        <button
          onClick={() => setIsOpen((v) => !v)}
          style={{ margin: "1rem", padding: ".5rem" }}
        >
          {isOpen ? "Collapse" : "Open"}
        </button>
      </div>

      <div className="main-wrapper">
        <TopSection isOpen={isOpen} setIsOpen={() => setIsOpen((v) => !v)} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaChartBar,
//   FaUsers,
//   FaFileAlt,
//   FaUserTie,
//   FaClipboardList,
//   FaUpload,
// } from "react-icons/fa";

// import TopSection from "./TopSection";
// import Logo from "./../assets/Logo1.png";
// import "./sidebar.css";

// export default function AdminSidebar({ onLogout, children }) {
//   const [isOpen, setIsOpen] = useState(true); // default open so you can see labels while testing

//   const menuItems = [ analytics, 
//     { path: "/admin/analytics", name: "Analytics", icon: <FaChartBar /> },
//     { path: "/admin/documents", name: "Documents", icon: <FaFileAlt /> },
//     { path: "/admin/faculty", name: "Faculty", icon: <FaUserTie /> },
//     { path: "/admin/reports", name: "Reports", icon: <FaClipboardList /> },
//     { path: "/admin/students", name: "Students", icon: <FaUsers /> },
//     { path: "/admin/uploads", name: "Uploads", icon: <FaUpload /> },
//   ];

//   return (
//     <div className="admin-layout">
//       <div className="sidebar" style={{ width: isOpen ? "220px" : "64px" }}>
//         <div className="sidebar-logo" style={{ display: isOpen ? "block" : "none" }}>
//           <img src={Logo} alt="Logo" className="logo-img" />
//         </div>

//         {menuItems.map((item, idx) => (
//           <NavLink
//             to={item.path}
//             key={idx}
//             className={({ isActive }) => "link" + (isActive ? " active" : "")}
//             style={{ marginTop: idx === 0 ? "1rem" : undefined }}
//           >
//             <div className="icon">{item.icon}</div>
//             <div className="link-text" style={{ display: isOpen ? "block" : "none" }}>
//               {item.name}
//             </div>
//           </NavLink>
//         ))}

//         <button onClick={onLogout} className="logout-btn">Logout</button>

//         {/* small toggle for testing */}
//         <button
//           onClick={() => setIsOpen(v => !v)}
//           style={{ margin: "1rem", padding: ".5rem", cursor: "pointer" }}
//         >
//           {isOpen ? "Collapse" : "Open"}
//         </button>
//       </div>

//       <div className="main-wrapper">
//         <TopSection isOpen={isOpen} setIsOpen={() => setIsOpen(v => !v)} />
//         <main className="main-content">
//           {/* render the page component passed from App.jsx */}
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaChartBar,
//   FaUsers,
//   FaFileAlt,
//   FaUserTie,
//   FaClipboardList,
//   FaUpload,
// } from "react-icons/fa";

// import TopSection from "./TopSection";
// import Logo from "./../assets/Logo1.png";
// import "./sidebar.css";

// export default function AdminSidebar({ onLogout, children }) {
//   const [isOpen, setIsOpen] = useState(true); // default open for testing

//   const menuItems = [
//     { path: "/admin/analytics", name: "Analytics", icon: <FaChartBar /> },
//     { path: "/admin/documents", name: "Documents", icon: <FaFileAlt /> },
//     { path: "/admin/faculty", name: "Faculty", icon: <FaUserTie /> },
//     { path: "/admin/reports", name: "Reports", icon: <FaClipboardList /> },
//     { path: "/admin/students", name: "Students", icon: <FaUsers /> },
//     { path: "/admin/uploads", name: "Uploads", icon: <FaUpload /> },
//   ];

//   return (
//     <div className="admin-layout">
//       {/* Sidebar */}
//       <div className="sidebar" style={{ width: isOpen ? "220px" : "64px" }}>
//         <div
//           className="sidebar-logo"
//           style={{ display: isOpen ? "block" : "none" }}
//         >
//           <img src={Logo} alt="Logo" className="logo-img" />
//         </div>

//         {menuItems.map((item, idx) => (
//           <NavLink
//             to={item.path}
//             key={idx}
//             className={({ isActive }) => "link" + (isActive ? " active" : "")}
//             style={{ marginTop: idx === 0 ? "1rem" : undefined }}
//           >
//             <div className="icon">{item.icon}</div>
//             <div
//               className="link-text"
//               style={{ display: isOpen ? "block" : "none" }}
//             >
//               {item.name}
//             </div>
//           </NavLink>
//         ))}

//         <button onClick={onLogout} className="logout-btn">
//           Logout
//         </button>

//         {/* Small toggle for testing */}
//         <button
//           onClick={() => setIsOpen((v) => !v)}
//           style={{ margin: "1rem", padding: ".5rem", cursor: "pointer" }}
//         >
//           {isOpen ? "Collapse" : "Open"}
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="main-wrapper">
//         <TopSection isOpen={isOpen} setIsOpen={() => setIsOpen((v) => !v)} />
//         <main className="main-content">{children}</main>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react"; 
// import { Routes, Route, NavLink } from "react-router-dom";
// import {
//   FaChartBar,
//   FaUsers,
//   FaFileAlt,
//   FaUserTie,
//   FaClipboardList,
//   FaUpload,
// } from "react-icons/fa";

// // Admin Pages
// import Analytics from "./Analytics";
// import Documents from "./Documents";
// import Faculty from "./Faculty";
// import Reports from "./Reports";
// import Students from "./Students";
// import Uploads from "./Uploads";
// import TopSection from "./TopSection";

// // ✅ Import logo
// import Logo from "./../assets/Logo1.png"; 

// import "./sidebar.css";

// export default function AdminSidebar({ onLogout }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const menuItems = [
//     { path: "/analytics", name: "Analytics", icon: <FaChartBar />  },
//     { path: "/documents", name: "Documents", icon: <FaFileAlt /> },
//     { path: "/faculty", name: "Faculty", icon: <FaUserTie /> },
//     { path: "/reports", name: "Reports", icon: <FaClipboardList /> },
//     { path: "/students", name: "Students", icon: <FaUsers /> },
//     { path: "/uploads", name: "Uploads", icon: <FaUpload /> },
//   ];

//   return (
//     <div className="admin-layout">
//       {/* Sidebar */}
//       <div className="sidebar" style={{ width: isOpen ? "210px" : "60px" }}>
//         {/* ✅ Logo */}
//         <div className="sidebar-logo" style={{ display: isOpen ? "block" : "none" }}>
//           <img src={Logo} alt="Logo" className="logo-img" />
//         </div>

//         {/* {menuItems.map((item, index) => (
//           <NavLink 
//             to={item.path} 
//             key={index} 
//             className="link" 
//             activeclassname="active"
//           >
//             <div className="icon">{item.icon}</div>
//             <div className="link-text" style={{ display: isOpen ? "block" : "none" }}>
//               {item.name}
//             </div>
//           </NavLink>
//         ))} */}

//        {menuItems.map((item, index) => (
//   <NavLink 
//     to={item.path} 
//     key={index} 
//     className="link" 
//     activeclassname="active"
//     style={{ marginTop: !isOpen && index === 0 ? "5rem" : "0" }} // ✅ move the row down
//   >
//     <div className="icon">
//       {item.icon}
//     </div>
//     <div 
//       className="link-text" 
//       style={{ display: isOpen ? "block" : "none" }}
//     >
//       {item.name}
//     </div>
//   </NavLink>
// ))}



//         <button onClick={onLogout} className="logout-btn">
//           Logout
//         </button>
//       </div>

//       {/* Right Side (Top + Content) */}
//       <div className="main-wrapper">
//         {/* ✅ Pass sidebar toggle into TopSection */}
//         <TopSection isOpen={isOpen} setIsOpen={setIsOpen} />
        
//         <main className="main-content">
//           <Routes>
//             <Route path="/analytics" element={<Analytics />} />
//             <Route path="/documents" element={<Documents />} />
//             <Route path="/faculty" element={<Faculty />} />
//             <Route path="/reports" element={<Reports />} />
//             <Route path="/students" element={<Students />} />
//             <Route path="/uploads" element={<Uploads />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }
