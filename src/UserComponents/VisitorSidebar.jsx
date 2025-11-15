import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaSearch, FaHeart, FaBookReader, FaQuoteRight } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { GrDocumentUpload } from "react-icons/gr";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { TbWorld } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";

import TopSection from "./TopSection";
import Logo from "./../assets/Logo1.png";
import "./sidebar.css";

export default function VisitorSidebar({ onLogout, children }) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { path: "/dashboard", name: "Search", icon: <FaSearch /> },
    { path: "/profile", name: "Profile", icon: <ImProfile /> },
    { path: "/collaboration", name: "Collaboration", icon: <GrDocumentUpload /> },
    { path: "/favorite", name: "Favorite", icon: <FaHeart /> },
    { path: "/published", name: "Published", icon: <HiOutlineDocumentDownload /> },
    { path: "/download", name: "Download", icon: <HiOutlineDocumentDownload /> },
    { path: "/read", name: "Read", icon: <FaBookReader /> },
    { path: "/citedpaper", name: "Cited Paper", icon: <FaQuoteRight /> },
    { path: "/explore", name: "Explore", icon: <TbWorld /> },
    { path: "/setting", name: "Setting", icon: <IoSettings /> },
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

      <div className="main-wrapper">
        <TopSection isOpen={isOpen} setIsOpen={() => setIsOpen(v => !v)} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { FaSearch, FaHeart, FaBookReader, FaQuoteRight } from "react-icons/fa";
// import { ImProfile } from "react-icons/im";
// import { GrDocumentUpload } from "react-icons/gr";
// import { HiOutlineDocumentDownload } from "react-icons/hi";
// import { TbWorld } from "react-icons/tb";
// import { IoSettings } from "react-icons/io5";

// import TopSection from "./TopSection";
// import Logo from "./../assets/Logo1.png";
// import "./sidebar.css";

// export default function VisitorSidebar({ onLogout, children }) {
//   const [isOpen, setIsOpen] = useState(true);

//   const menuItems = [
//     { path: "/dashboard", name: "Search", icon: <FaSearch /> },
//     { path: "/profile", name: "Profile", icon: <ImProfile /> },
//     { path: "/collaboration", name: "Collaboration", icon: <GrDocumentUpload /> },
//     { path: "/favorite", name: "Favorite", icon: <FaHeart /> },
//     { path: "/published", name: "Published", icon: <HiOutlineDocumentDownload /> },
//     { path: "/download", name: "Download", icon: <HiOutlineDocumentDownload /> },
//     { path: "/read", name: "Read", icon: <FaBookReader /> },
//     { path: "/citedpaper", name: "Cited Paper", icon: <FaQuoteRight /> },
//     { path: "/explore", name: "Explore", icon: <TbWorld /> },
//     { path: "/setting", name: "Setting", icon: <IoSettings /> },
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

//         <button onClick={() => setIsOpen(v => !v)} style={{ margin: "1rem", padding: ".5rem" }}>
//           {isOpen ? "Collapse" : "Open"}
//         </button>
//       </div>

//       <div className="main-wrapper">
//         <TopSection isOpen={isOpen} setIsOpen={() => setIsOpen(v => !v)} />
//         <main className="main-content">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import { FaSearch, FaHeart, FaBookReader, FaQuoteRight } from "react-icons/fa";
// import { ImProfile } from "react-icons/im";
// import { GrDocumentUpload } from "react-icons/gr";
// import { HiOutlineDocumentDownload } from "react-icons/hi";
// import { TbWorld } from "react-icons/tb";
// import { IoSettings } from "react-icons/io5";

// import TopSection from "./TopSection";
// import Logo from "./../assets/Logo1.png";
// import "./sidebar.css";

// export default function VisitorSidebar({ onLogout }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const menuItems = [
//   { path: "dashboard", name: "Search", icon: <FaSearch /> },
//   { path: "profile", name: "Profile", icon: <ImProfile /> },
//   { path: "collaboration", name: "Collaboration", icon: <GrDocumentUpload /> },
//   { path: "favorite", name: "Favorite", icon: <FaHeart /> },
//   { path: "published", name: "Published", icon: <HiOutlineDocumentDownload /> },
//   { path: "download", name: "Download", icon: <HiOutlineDocumentDownload /> },
//   { path: "read", name: "Read", icon: <FaBookReader /> },
//   { path: "citedpaper", name: "Cited Paper", icon: <FaQuoteRight /> },
//   { path: "explore", name: "Explore", icon: <TbWorld /> },
//   { path: "setting", name: "Setting", icon: <IoSettings /> },
// ];


//   return (
//     <div className="admin-layout">
//       {/* Sidebar */}
//       <div className="sidebar" style={{ width: isOpen ? "210px" : "60px" }}>
//         {/* Logo */}
//         <div className="sidebar-logo" style={{ display: isOpen ? "block" : "none" }}>
//           <img src={Logo} alt="Logo" className="logo-img" />
//         </div>

//         {/* Sidebar Links */}
//         {menuItems.map((item, index) => (
//           <NavLink
//             to={item.path}
//             key={index}
//             className="link"
//             activeclassname="active"
//             style={{ marginTop: !isOpen && index === 0 ? "5rem" : "0" }}
//           >
//             <div className="icon">{item.icon}</div>
//             <div className="link-text" style={{ display: isOpen ? "block" : "none" }}>
//               {item.name}
//             </div>
//           </NavLink>
//         ))}

//         <button onClick={onLogout} className="logout-btn">
//           Logout
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="main-wrapper">
//         <TopSection isOpen={isOpen} setIsOpen={setIsOpen} />
//         <main className="main-content">
//           <Outlet /> {/* 👈 renders child routes defined in App.jsx */}
//         </main>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { Routes, Route, NavLink } from "react-router-dom";
// import { FaSearch, FaHeart, FaBookReader, FaQuoteRight } from "react-icons/fa";
// import { ImProfile } from "react-icons/im";
// import { GrDocumentUpload } from "react-icons/gr";
// import { HiOutlineDocumentDownload } from "react-icons/hi";
// import { TbWorld } from "react-icons/tb";
// import { IoSettings } from "react-icons/io5";

// // Visitor Pages
// import UserDashboard from "./UserDashboard";
// import Profile from "./Profile";
// import Collaboration from "./Collaboration";
// import Favorite from "./Favorite";
// import Published from "./Published";
// import Download from "./Download";
// import Read from "./Read";
// import Citedpaper from "./Citedpaper";
// import Explore from "./Explore";
// import Setting from "./Setting";

// // TopSection Component
// import TopSection from "./TopSection";

// import Logo from "./../assets/Logo1.png"; 
// import "./sidebar.css";

// export default function VisitorSidebar({ onLogout }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const menuItems = [
//     { path: "dashboard", name: "Search", icon: <FaSearch /> },
//     { path: "profile", name: "Profile", icon: <ImProfile /> },
//     { path: "collaboration", name: "Collaboration", icon: <GrDocumentUpload /> },
//     { path: "favorite", name: "Favorite", icon: <FaHeart /> },
//     { path: "published", name: "Published", icon: <HiOutlineDocumentDownload /> },
//     { path: "download", name: "Download", icon: <HiOutlineDocumentDownload /> },
//     { path: "read", name: "Read", icon: <FaBookReader /> },
//     { path: "citedpaper", name: "Cited Paper", icon: <FaQuoteRight /> },
//     { path: "explore", name: "Explore", icon: <TbWorld /> },
//     { path: "setting", name: "Setting", icon: <IoSettings /> },
//   ];

//   return (
//     <div className="admin-layout">
//       {/* Sidebar */}
//       <div className="sidebar" style={{ width: isOpen ? "210px" : "60px" }}>
//         <div className="sidebar-logo" style={{ display: isOpen ? "block" : "none" }}>
//           <img src={Logo} alt="Logo" className="logo-img" />
//         </div>

//         {/* Sidebar links */}
//         {menuItems.map((item, index) => (
//           <NavLink 
//             to={item.path} 
//             key={index} 
//             className="link" 
//             activeclassname="active"
//             style={{ marginTop: !isOpen && index === 0 ? "5rem" : "0" }}
//           >
//             <div className="icon">{item.icon}</div>
//             <div className="link-text" style={{ display: isOpen ? "block" : "none" }}>
//               {item.name}
//             </div>
//           </NavLink>
//         ))}

//         <button onClick={onLogout} className="logout-btn">
//           Logout
//         </button>
//       </div>

//       {/* Right Side */}
//       <div className="main-wrapper">
//         <TopSection isOpen={isOpen} setIsOpen={setIsOpen} />
        
//         <main className="main-content">
//           <Routes>
//             <Route path="dashboard" element={<UserDashboard />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="collaboration" element={<Collaboration />} />
//             <Route path="favorite" element={<Favorite />} />
//             <Route path="published" element={<Published />} />
//             <Route path="download" element={<Download />} />
//             <Route path="read" element={<Read />} />
//             <Route path="citedpaper" element={<Citedpaper />} />
//             <Route path="explore" element={<Explore />} />
//             <Route path="setting" element={<Setting />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }










// import React, { useState } from "react";
// import { Routes, Route, NavLink } from "react-router-dom";
// import { FaHome, FaSearch, FaHeart, FaBookReader, FaQuoteRight } from "react-icons/fa";

// import { ImProfile } from "react-icons/im";
// import { GrDocumentUpload } from "react-icons/gr";
// import { HiOutlineDocumentDownload } from "react-icons/hi";
// import { TbWorld } from "react-icons/tb";
// import { IoSettings } from "react-icons/io5";

// // Visitor Pages
// import UserDashboard from "./UserDashboard";
// import Profile from "./Profile";
// import Collaboration from "./Collaboration";
// import Favorite from "./Favorite";
// import Published from "./Published";
// import Download from "./Download";
// import Read from "./Read";
// import Citedpaper from "./Citedpaper";
// import Explore from "./Explore";
// import Setting from "./Setting";

// // TopSection Component
// import TopSection from "./TopSection";

// import "./sidebar.css";

// // ✅ Import logo
// import Logo from "./../assets/Logo1.png"; 

// import "./sidebar.css";

// export default function VisitorSidebar({ onLogout }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const menuItems = [
//      { path: "/dashboard", name: "Search", icon: <FaSearch /> },
//     { path: "/profile", name: "Profile", icon: <ImProfile /> },
//     { path: "/collaboration", name: "Collaboration", icon: <GrDocumentUpload /> },
//     { path: "/favorite", name: "Favorite", icon: <FaHeart /> },
//     { path: "/published", name: "Published", icon: <HiOutlineDocumentDownload /> },
//     { path: "/download", name: "Download", icon: <HiOutlineDocumentDownload /> },
//     { path: "/read", name: "Read", icon: <FaBookReader /> },
//     { path: "/citedpaper", name: "Cited Paper", icon: <FaQuoteRight /> },
//     { path: "/explore", name: "Explore", icon: <TbWorld /> },
//     { path: "/setting", name: "Setting", icon: <IoSettings /> },
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



//          <button onClick={onLogout} className="logout-btn">
//           Logout
//         </button> 
//       </div>

//       {/* Right Side (Top + Content) */}
//       <div className="main-wrapper">
//         {/* ✅ Pass sidebar toggle into TopSection */}
//         <TopSection isOpen={isOpen} setIsOpen={setIsOpen} />
        
//         <main className="main-content">
//          <Routes>
//             <Route path="/dashboard" element={<UserDashboard />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/collaboration" element={<Collaboration />} />
//             <Route path="/favorite" element={<Favorite />} />
//             <Route path="/published" element={<Published />} />
//             <Route path="/download" element={<Download />} />
//             <Route path="/read" element={<Read />} />
//             <Route path="/citedpaper" element={<Citedpaper />} />
//             <Route path="/explore" element={<Explore />} />
//             <Route path="/setting" element={<Setting />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }
