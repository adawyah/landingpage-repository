import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Auth
import Register from "./Register";
import Login from "./Login";

// Layouts LANDING PAGE
import Visitor from "./UserComponents/VisitorSidebar";
import Admin from "./AdminComponents/AdminSidebar";
import Advisor from "./AdvisorComponents/AdvisorSidebar";
import Proponent from "./ProponentComponents/ProponentSidebar";
import ResearchCoordinator from "./RCComponents/ResearchCoordinatorSidebar";

// Visitor pages
import UserDashboard from "./UserComponents/UserDashboard";


// SIDEBAR COMPONENTS
import Collaboration from "./UserComponents/Collaboration";
import Profile from "./UserComponents/Profile";
import Favorite from "./UserComponents/Favorite";
import Published from "./UserComponents/Published";
import Download from "./UserComponents/Download";
import Read from "./UserComponents/Read";
import Citedpaper from "./UserComponents/Citedpaper";
import Explore from "./UserComponents/Explore";
import Setting from "./UserComponents/Setting";



// Admin pages
import Analytics from "./AdminComponents/Analytics";
import Academics from "./AdminComponents/Academics";
import Documents from "./AdminComponents/Documents";
import Faculty from "./AdminComponents/Faculty";
import Reports from "./AdminComponents/Reports";
import Students from "./AdminComponents/Students";
import Uploads from "./AdminComponents/Uploads";

// Advisor
import AdvisorDashboard from "./AdvisorComponents/AdvisorDashboard";
import ProponentRequest from "./AdvisorComponents/ProponentRequest";
import CollaborationAdvisor from "./AdvisorComponents/CollaborationAdvisor";


// Proponent
import ProponentDashboard from "./ProponentComponents/ProponentDashboard";
import CollaborationProponent from "./ProponentComponents/CollaborationProponent";


//RC

import AdvisorsPerDepartment from "./RCComponents/AdvisorsPerDepartment";
import DepartmentArchives from "./RCComponents/DepartmentArchives";
import Submissionreview from "./RCComponents/Submissionreview";
import RcDashboard from "./RCComponents/RcDashboard";



function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      if (!token) {
        setLoading(false);
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const res = await axios.get("/me");
        console.log("fetch /me ->", res.data);
        // Use backend's is_admin, is_advisor, etc. flags directly
        setUser(res.data.user);
      } catch (err) {
        console.error("Fetch /me failed:", err.response?.data || err.message);
        setUser(null);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [token]);

  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setLoading(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken("");
    setUser(null);
  };

  if (loading) return <p>Loading user info...</p>;

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Decide landing page based on role
  const landing =
    user?.is_admin ? "/admin/analytics" :
    user?.is_advisor ? "/advisor/dashboard" :
    user?.is_proponent ? "/proponent/dashboard" :
    user?.is_research_coordinator ? "/rc/dashboard" :
    "/dashboard";

  return (
    <Routes>
      {/* Redirect root to landing */}
      <Route path="/" element={<Navigate to={landing} replace />} />

      {/* ADMIN routes */}
      {user?.is_admin && (
        <Route
          path="/admin/*"
          element={
            <Admin onLogout={handleLogout}>
              {/* Nest Admin pages here */}
              <Routes>
                <Route path="analytics" element={<Analytics />} />
                <Route path="documents" element={<Documents />} />
                <Route path="faculty" element={<Faculty />} />
                 <Route path="Academics" element={<Academics />} />
                <Route path="reports" element={<Reports />} />
                <Route path="students" element={<Students />} />
                <Route path="uploads" element={<Uploads />} />
              </Routes>
            </Admin>
          }
        />
      )}

      {/* ADVISOR routes */}
      {user?.is_advisor && (
        <Route
          path="/advisor/*"
          element={
            <Advisor onLogout={handleLogout} user={user}>
              <Routes>
                <Route path="dashboard" element={<AdvisorDashboard />} />
                <Route path="profile" element={<Profile />} />
                  <Route path="proponent" element={<ProponentRequest />} />
                <Route path="CollaborationAdvisor" element={<CollaborationAdvisor />} />
                <Route path="favorite" element={<Favorite />} />
                <Route path="published" element={<Published />} />
                <Route path="download" element={<Download />} />
                <Route path="read" element={<Read />} />
                <Route path="citedpaper" element={<Citedpaper />} />
                <Route path="explore" element={<Explore />} />
                <Route path="setting" element={<Setting />} />
              </Routes>
            </Advisor>
          }
        />
      )}

      {/* PROPONENT routes */}
      {user?.is_proponent && (
        <Route
          path="/proponent/*"
          element={
            <Proponent onLogout={handleLogout} user={user}>
              <Routes>
                <Route path="dashboard" element={<ProponentDashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="CollaborationProponent" element={<CollaborationProponent />} />
                <Route path="favorite" element={<Favorite />} />
                <Route path="published" element={<Published />} />
                <Route path="download" element={<Download />} />
                <Route path="read" element={<Read />} />
                <Route path="citedpaper" element={<Citedpaper />} />
                <Route path="explore" element={<Explore />} />
                <Route path="setting" element={<Setting />} />
              </Routes>
            </Proponent>
          }
        />
      )}

      {/* RESEARCH COORDINATOR routes */}
      {user?.is_research_coordinator && (
        <Route
          path="/rc/*"
          element={
            <ResearchCoordinator onLogout={handleLogout} user={user}>
              <Routes>
                <Route path="dashboard" element={<RcDashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="deptadvisors" element={<AdvisorsPerDepartment />} />
                <Route path="submissionreview" element={<Submissionreview />} />
                <Route path="departmentArchives" element={<DepartmentArchives />} />
                <Route path="read" element={<Read />} />
                <Route path="published" element={<Published />} />
                <Route path="favorite" element={<Favorite />} />
                <Route path="download" element={<Download />} />
                <Route path="setting" element={<Setting />} />

              </Routes>
            </ResearchCoordinator>
          }
        />
      )}

      {/* VISITOR routes (only if no role) */}
      {!user?.is_admin &&
        !user?.is_advisor &&
        !user?.is_proponent &&
        !user?.is_research_coordinator && (
          <>
            <Route path="/dashboard" element={<Visitor onLogout={handleLogout}><UserDashboard /></Visitor>} />
            <Route path="/profile" element={<Visitor onLogout={handleLogout}><Profile /></Visitor>} />
            <Route path="/collaboration" element={<Visitor onLogout={handleLogout}><Collaboration /></Visitor>} />
            <Route path="/favorite" element={<Visitor onLogout={handleLogout}><Favorite /></Visitor>} />
            <Route path="/published" element={<Visitor onLogout={handleLogout}><Published /></Visitor>} />
            <Route path="/download" element={<Visitor onLogout={handleLogout}><Download /></Visitor>} />
            <Route path="/read" element={<Visitor onLogout={handleLogout}><Read /></Visitor>} />
            <Route path="/citedpaper" element={<Visitor onLogout={handleLogout}><Citedpaper /></Visitor>} />
            <Route path="/explore" element={<Visitor onLogout={handleLogout}><Explore /></Visitor>} />
            <Route path="/setting" element={<Visitor onLogout={handleLogout}><Setting /></Visitor>} />
          </>
        )}

      {/* Fallback */}
      <Route path="*" element={<Navigate to={landing} replace />} />
    </Routes>
  );
}

export default App;














// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Routes, Route, Navigate } from "react-router-dom";

// axios.defaults.baseURL = "http://localhost:8000/api";

// // Auth
// import Register from "./Register";
// import Login from "./Login";

// // Layouts
// import Visitor from "./UserComponents/VisitorSidebar";
// import Admin from "./AdminComponents/AdminSidebar";
// import Advisor from "./AdvisorComponents/AdvisorSidebar";
// import Proponent from "./ProponentComponents/ProponentSidebar";
// import ResearchCoordinator from "./RCComponents/ResearchCoordinatorSidebar";

// // Visitor pages
// import UserDashboard from "./UserComponents/UserDashboard";
// import Profile from "./UserComponents/Profile";
// import Collaboration from "./UserComponents/Collaboration";
// import Favorite from "./UserComponents/Favorite";
// import Published from "./UserComponents/Published";
// import Download from "./UserComponents/Download";
// import Read from "./UserComponents/Read";
// import Citedpaper from "./UserComponents/Citedpaper";
// import Explore from "./UserComponents/Explore";
// import Setting from "./UserComponents/Setting";

// // Proponent
// import ProponentDashboard from "./ProponentComponents/ProponentDashboard";

// // Advisor
// import AdvisorDashboard from "./AdvisorComponents/AdvisorDashboard";

// // Admin pages
// import Analytics from "./AdminComponents/Analytics";
// import Documents from "./AdminComponents/Documents";
// import Faculty from "./AdminComponents/Faculty";
// import Reports from "./AdminComponents/Reports";
// import Students from "./AdminComponents/Students";
// import Uploads from "./AdminComponents/Uploads";

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   async function fetchMe() {
//   //     if (!token) {
//   //       setLoading(false);
//   //       return;
//   //     }
//   //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   //     try {
//   //       const res = await axios.get("/me");
//   //       console.log("fetch /me ->", res.data);
//   //       setUser(res.data.user);
//   //     } catch (err) {
//   //       console.error("Fetch /me failed:", err.response?.data || err.message);
//   //       setUser(null);
//   //       localStorage.removeItem("token");
//   //       delete axios.defaults.headers.common["Authorization"];
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }
//   //   fetchMe();
//   // }, [token]);


//   useEffect(() => {
//   async function fetchMe() {
//     if (!token) {
//       setLoading(false);
//       return;
//     }
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     try {
//       const res = await axios.get("/me");
//       console.log("fetch /me ->", res.data);

//       const roles = res.data.roles?.map(r => r.name) || [];

//       setUser({
//         ...res.data.user,
//         roles,
//         is_admin: roles.includes("admin"),
//         is_advisor: roles.includes("advisor"),
//         is_proponent: roles.includes("proponent"),
//         is_research_coordinator: roles.includes("research_coordinator"),
//       });
//     } catch (err) {
//       console.error("Fetch /me failed:", err.response?.data || err.message);
//       setUser(null);
//       localStorage.removeItem("token");
//       delete axios.defaults.headers.common["Authorization"];
//     } finally {
//       setLoading(false);
//     }
//   }
//   fetchMe();
// }, [token]);

//   const handleLogin = (data) => {
//     localStorage.setItem("token", data.token);
//     axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//     setToken(data.token);
//     setLoading(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     delete axios.defaults.headers.common["Authorization"];
//     setToken("");
//     setUser(null);
//   };

//   if (loading) return <p>Loading user info...</p>;

//   if (!token) {
//     return (
//       <div>
//         <h1>Welcome</h1>
//         <Register />
//         <Login onLogin={handleLogin} />
//       </div>
//     );
//   }

//   const landing =
//     user?.is_admin ? "/admin/analytics" :
//     user?.is_advisor ? "/advisor/dashboard" :
//     user?.is_proponent ? "/proponent/dashboard" :
//     user?.is_research_coordinator ? "/rc/dashboard" :
//     "/dashboard";

//   return (
//     <Routes>
//       {/* Redirect root */}
//       <Route path="/" element={<Navigate to={landing} replace />} />

//       {/* ADMIN routes */}
//       {user?.is_admin && (
//         <>
//           <Route path="/admin/analytics" element={<Admin onLogout={handleLogout}><Analytics /></Admin>} />
//           <Route path="/admin/documents" element={<Admin onLogout={handleLogout}><Documents /></Admin>} />
//           <Route path="/admin/faculty" element={<Admin onLogout={handleLogout}><Faculty /></Admin>} />
//           <Route path="/admin/reports" element={<Admin onLogout={handleLogout}><Reports /></Admin>} />
//           <Route path="/admin/students" element={<Admin onLogout={handleLogout}><Students /></Admin>} />
//           <Route path="/admin/uploads" element={<Admin onLogout={handleLogout}><Uploads /></Admin>} />
//         </>
//       )}

//       {/* ADVISOR routes */}
//       {user?.is_advisor && (
//         <>
//           <Route path="/advisor/dashboard" element={<Advisor onLogout={handleLogout}><AdvisorDashboard/></Advisor>} />
//           <Route path="/advisor/profile" element={<Advisor onLogout={handleLogout}><Profile /></Advisor>} />
//           <Route path="/advisor/collaboration" element={<Advisor onLogout={handleLogout}><Collaboration /></Advisor>} />
//           <Route path="/advisor/favorite" element={<Advisor onLogout={handleLogout}><Favorite /></Advisor>} />
//           <Route path="/advisor/published" element={<Advisor onLogout={handleLogout}><Published /></Advisor>} />
//           <Route path="/advisor/download" element={<Advisor onLogout={handleLogout}><Download /></Advisor>} />
//           <Route path="/advisor/read" element={<Advisor onLogout={handleLogout}><Read /></Advisor>} />
//           <Route path="/advisor/citedpaper" element={<Advisor onLogout={handleLogout}><Citedpaper /></Advisor>} />
//           <Route path="/advisor/explore" element={<Advisor onLogout={handleLogout}><Explore /></Advisor>} />
//           <Route path="/advisor/setting" element={<Advisor onLogout={handleLogout}><Setting /></Advisor>} />
//         </>
//       )}

//       {/* PROPONENT routes */}
//       {user?.is_proponent && (
//         <>
//           <Route path="/proponent/dashboard" element={<Proponent onLogout={handleLogout}><ProponentDashboard /></Proponent>} />
//           <Route path="/proponent/profile" element={<Proponent onLogout={handleLogout}><Profile /></Proponent>} />
//           <Route path="/proponent/collaboration" element={<Proponent onLogout={handleLogout}><Collaboration /></Proponent>} />
//           <Route path="/proponent/favorite" element={<Proponent onLogout={handleLogout}><Favorite /></Proponent>} />
//           <Route path="/proponent/published" element={<Proponent onLogout={handleLogout}><Published /></Proponent>} />
//           <Route path="/proponent/download" element={<Proponent onLogout={handleLogout}><Download /></Proponent>} />
//           <Route path="/proponent/read" element={<Proponent onLogout={handleLogout}><Read /></Proponent>} />
//           <Route path="/proponent/citedpaper" element={<Proponent onLogout={handleLogout}><Citedpaper /></Proponent>} />
//           <Route path="/proponent/explore" element={<Proponent onLogout={handleLogout}><Explore /></Proponent>} />
//           <Route path="/proponent/setting" element={<Proponent onLogout={handleLogout}><Setting /></Proponent>} />
//         </>
//       )}

//       {/* RESEARCH COORDINATOR routes */}
//       {user?.is_research_coordinator && (
//         <>
//           <Route path="/rc/dashboard" element={<ResearchCoordinator onLogout={handleLogout}><UserDashboard /></ResearchCoordinator>} />
//           <Route path="/rc/profile" element={<ResearchCoordinator onLogout={handleLogout}><Profile /></ResearchCoordinator>} />
//           <Route path="/rc/collaboration" element={<ResearchCoordinator onLogout={handleLogout}><Collaboration /></ResearchCoordinator>} />
//           <Route path="/rc/favorite" element={<ResearchCoordinator onLogout={handleLogout}><Favorite /></ResearchCoordinator>} />
//           <Route path="/rc/published" element={<ResearchCoordinator onLogout={handleLogout}><Published /></ResearchCoordinator>} />
//           <Route path="/rc/download" element={<ResearchCoordinator onLogout={handleLogout}><Download /></ResearchCoordinator>} />
//           <Route path="/rc/read" element={<ResearchCoordinator onLogout={handleLogout}><Read /></ResearchCoordinator>} />
//           <Route path="/rc/citedpaper" element={<ResearchCoordinator onLogout={handleLogout}><Citedpaper /></ResearchCoordinator>} />
//           <Route path="/rc/explore" element={<ResearchCoordinator onLogout={handleLogout}><Explore /></ResearchCoordinator>} />
//           <Route path="/rc/setting" element={<ResearchCoordinator onLogout={handleLogout}><Setting /></ResearchCoordinator>} />
//         </>
//       )}

//       {/* VISITOR routes */}
//       {/* <Route path="/dashboard" element={<Visitor onLogout={handleLogout}><UserDashboard /></Visitor>} />
//       <Route path="/profile" element={<Visitor onLogout={handleLogout}><Profile /></Visitor>} />
//       <Route path="/collaboration" element={<Visitor onLogout={handleLogout}><Collaboration /></Visitor>} />
//       <Route path="/favorite" element={<Visitor onLogout={handleLogout}><Favorite /></Visitor>} />
//       <Route path="/published" element={<Visitor onLogout={handleLogout}><Published /></Visitor>} />
//       <Route path="/download" element={<Visitor onLogout={handleLogout}><Download /></Visitor>} />
//       <Route path="/read" element={<Visitor onLogout={handleLogout}><Read /></Visitor>} />
//       <Route path="/citedpaper" element={<Visitor onLogout={handleLogout}><Citedpaper /></Visitor>} />
//       <Route path="/explore" element={<Visitor onLogout={handleLogout}><Explore /></Visitor>} />
//       <Route path="/setting" element={<Visitor onLogout={handleLogout}><Setting /></Visitor>} /> */}

//       {/* VISITOR routes */}
// {!user?.is_admin && !user?.is_advisor && !user?.is_proponent && !user?.is_research_coordinator && (
//   <>
//     <Route path="/dashboard" element={<Visitor onLogout={handleLogout}><UserDashboard /></Visitor>} />
//     <Route path="/profile" element={<Visitor onLogout={handleLogout}><Profile /></Visitor>} />
//     <Route path="/collaboration" element={<Visitor onLogout={handleLogout}><Collaboration /></Visitor>} />
//     <Route path="/favorite" element={<Visitor onLogout={handleLogout}><Favorite /></Visitor>} />
//     <Route path="/published" element={<Visitor onLogout={handleLogout}><Published /></Visitor>} />
//     <Route path="/download" element={<Visitor onLogout={handleLogout}><Download /></Visitor>} />
//     <Route path="/read" element={<Visitor onLogout={handleLogout}><Read /></Visitor>} />
//     <Route path="/citedpaper" element={<Visitor onLogout={handleLogout}><Citedpaper /></Visitor>} />
//     <Route path="/explore" element={<Visitor onLogout={handleLogout}><Explore /></Visitor>} />
//     <Route path="/setting" element={<Visitor onLogout={handleLogout}><Setting /></Visitor>} />
//   </>
// )}


//       {/* Fallback */}
//       <Route path="*" element={<Navigate to={landing} replace />} />
//     </Routes>
//   );
// }

// export default App;










// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Routes, Route, Navigate } from "react-router-dom";

// axios.defaults.baseURL = "http://localhost:8000/api";

// // Auth
// import Register from "./Register";
// import Login from "./Login";

// // Layouts
// import Visitor from "./UserComponents/VisitorSidebar";
// import Admin from "./AdminComponents/AdminSidebar";
// import Advisor from "./AdvisorComponents/AdvisorSidebar";
// import Proponent from "./ProponentComponents/ProponentSidebar";
// import ResearchCoordinator from "./RCComponents/ResearchCoordinatorSidebar";

// // Visitor pages
// import UserDashboard from "./UserComponents/UserDashboard";
// import Profile from "./UserComponents/Profile";
// import Collaboration from "./UserComponents/Collaboration";
// import Favorite from "./UserComponents/Favorite";
// import Published from "./UserComponents/Published";
// import Download from "./UserComponents/Download";
// import Read from "./UserComponents/Read";
// import Citedpaper from "./UserComponents/Citedpaper";
// import Explore from "./UserComponents/Explore";
// import Setting from "./UserComponents/Setting";

// //ProponentDashboard
// import ProponentDashboard from "./ProponentComponents/ProponentDashboard";


// //advisor


// // Admin pages
// import Analytics from "./AdminComponents/Analytics";
// import Documents from "./AdminComponents/Documents";
// import Faculty from "./AdminComponents/Faculty";
// import Reports from "./AdminComponents/Reports";
// import Students from "./AdminComponents/Students";
// import Uploads from "./AdminComponents/Uploads";
// import AdvisorDashboard from "./AdvisorComponents/AdvisorDashboard";

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchMe() {
//       if (!token) {
//         setLoading(false);
//         return;
//       }
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       try {
//         const res = await axios.get("/me");
//         console.log("fetch /me ->", res.data);
//         setUser(res.data.user);
//       } catch (err) {
//         console.error("Fetch /me failed:", err.response?.data || err.message);
//         setUser(null);
//         localStorage.removeItem("token");
//         delete axios.defaults.headers.common["Authorization"];
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchMe();
//   }, [token]);

//   const handleLogin = (data) => {
//     localStorage.setItem("token", data.token);
//     axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//     setToken(data.token);
//     setLoading(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     delete axios.defaults.headers.common["Authorization"];
//     setToken("");
//     setUser(null);
//   };

//   if (loading) return <p>Loading user info...</p>;

//   if (!token) {
//     return (
//       <div>
//         <h1>Welcome</h1>
//         <Register />
//         <Login onLogin={handleLogin} />
//       </div>
//     );
//   }

//   const landing =
//     user?.is_admin ? "/admin/analytics" :
//     user?.is_advisor ? "/advisor/dashboard" :
//     user?.is_proponent ? "/proponent/dashboard" :
//     user?.is_research_coordinator ? "/rc/dashboard" :
//     "/dashboard";

//   return (
//     <Routes>
//       {/* Redirect root */}
//       <Route path="/" element={<Navigate to={landing} replace />} />

//       {/* ADMIN routes */}
//       {user?.is_admin && (
//         <>
//           <Route path="/admin/analytics" element={<Admin onLogout={handleLogout}><Analytics /></Admin>} />
//           <Route path="/admin/documents" element={<Admin onLogout={handleLogout}><Documents /></Admin>} />
//           <Route path="/admin/faculty" element={<Admin onLogout={handleLogout}><Faculty /></Admin>} />
//           <Route path="/admin/reports" element={<Admin onLogout={handleLogout}><Reports /></Admin>} />
//           <Route path="/admin/students" element={<Admin onLogout={handleLogout}><Students /></Admin>} />
//           <Route path="/admin/uploads" element={<Admin onLogout={handleLogout}><Uploads /></Admin>} />
//         </>
//       )}

//       {/* ADVISOR routes */}
//       {user?.is_advisor && (
//         <>
//           <Route path="/advisor/dashboard" element={<Advisor onLogout={handleLogout}><AdvisorDashboard/></Advisor>} />
//           <Route path="/advisor/profile" element={<Advisor onLogout={handleLogout}><Profile /></Advisor>} />
//         </>
//       )}

//       {/* PROPONENT routes */}
//       {user?.is_proponent && (
//         <>
//           <Route path="/proponent/dashboard" element={<Proponent onLogout={handleLogout}><ProponentDashboard /></Proponent>} />
//           <Route path="/proponent/profile" element={<Proponent onLogout={handleLogout}><Profile /></Proponent>} />
//         </>
//       )}

//       {/* RESEARCH COORDINATOR routes */}
//       {user?.is_research_coordinator && (
//         <>
//           <Route path="/rc/dashboard" element={<ResearchCoordinator onLogout={handleLogout}><UserDashboard /></ResearchCoordinator>} />
//           <Route path="/rc/profile" element={<ResearchCoordinator onLogout={handleLogout}><Profile /></ResearchCoordinator>} />
//         </>
//       )}

//       {/* VISITOR routes */}
//       <Route path="/dashboard" element={<Visitor onLogout={handleLogout}><UserDashboard /></Visitor>} />
//       <Route path="/profile" element={<Visitor onLogout={handleLogout}><Profile /></Visitor>} />
//       <Route path="/collaboration" element={<Visitor onLogout={handleLogout}><Collaboration /></Visitor>} />
//       <Route path="/favorite" element={<Visitor onLogout={handleLogout}><Favorite /></Visitor>} />
//       <Route path="/published" element={<Visitor onLogout={handleLogout}><Published /></Visitor>} />
//       <Route path="/download" element={<Visitor onLogout={handleLogout}><Download /></Visitor>} />
//       <Route path="/read" element={<Visitor onLogout={handleLogout}><Read /></Visitor>} />
//       <Route path="/citedpaper" element={<Visitor onLogout={handleLogout}><Citedpaper /></Visitor>} />
//       <Route path="/explore" element={<Visitor onLogout={handleLogout}><Explore /></Visitor>} />
//       <Route path="/setting" element={<Visitor onLogout={handleLogout}><Setting /></Visitor>} />

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to={landing} replace />} />
//     </Routes>
//   );
// }

// export default App;











// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// axios.defaults.baseURL = "http://localhost:8000/api";

// // Auth
// import Register from "./Register";
// import Login from "./Login";

// // Layouts (sidebars)
// import Visitor from "./UserComponents/VisitorSidebar";
// import Admin from "./AdminComponents/AdminSidebar";
// import Advisor from "./AdvisorComponents/AdvisorDashboard";
// import Proponent from "./ProponentSidebar";
// import ResearchCoordinator from "./ResearchCoordinatorSidebar";

// // Visitor pages
// import UserDashboard from "./UserComponents/UserDashboard";
// import Profile from "./UserComponents/Profile";
// import Collaboration from "./UserComponents/Collaboration";
// import Favorite from "./UserComponents/Favorite";
// import Published from "./UserComponents/Published";
// import Download from "./UserComponents/Download";
// import Read from "./UserComponents/Read";
// import Citedpaper from "./UserComponents/Citedpaper";
// import Explore from "./UserComponents/Explore";
// import Setting from "./UserComponents/Setting";

// // Admin pages
// import Analytics from "./AdminComponents/Analytics";
// import Documents from "./AdminComponents/Documents";
// import Faculty from "./AdminComponents/Faculty";
// import Reports from "./AdminComponents/Reports";
// import Students from "./AdminComponents/Students";
// import Uploads from "./AdminComponents/Uploads";

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch /me when token changes
//   useEffect(() => {
//     async function fetchMe() {
//       if (!token) {
//         setLoading(false);
//         return;
//       }
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       try {
//         const res = await axios.get("/me");
//         console.log("fetch /me ->", res.data);
//         setUser(res.data.user);
//       } catch (err) {
//         console.error("Fetch /me failed:", err.response?.data || err.message);
//         setUser(null);
//         localStorage.removeItem("token");
//         delete axios.defaults.headers.common["Authorization"];
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchMe();
//   }, [token]);

//   const handleLogin = (data) => {
//     localStorage.setItem("token", data.token);
//     axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//     setToken(data.token);
//     setLoading(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     delete axios.defaults.headers.common["Authorization"];
//     setToken("");
//     setUser(null);
//   };

//   if (loading) return <p>Loading user info...</p>;

//   if (!token) {
//     return (
//       <div>
//         <h1>Welcome</h1>
//         <Register />
//         <Login onLogin={handleLogin} />
//       </div>
//     );
//   }

//   // Compute landing page based on role
//   const landing =
//     user?.is_admin ? "/admin/analytics" :
//     user?.is_advisor ? "/advisor" :
//     user?.is_proponent ? "/proponent" :
//     user?.is_research_coordinator ? "/research-coordinator" :
//     "/dashboard";

//   return (
//     <Router>
//       <Routes>
//         {/* Root redirects to a role-specific landing */}
//         <Route path="/" element={<Navigate to={landing} replace />} />

//         {/* ---------------- ADMIN routes ----------------
//             Each route renders the Admin layout and passes the page as children.
//             This avoids nested route pitfalls and relative path confusion.
//         */}
//         {user?.is_admin && (
//           <>
//             <Route
//               path="/admin/analytics"
//               element={<Admin onLogout={handleLogout}><Analytics /></Admin>}
//             />
//             <Route
//               path="/admin/documents"
//               element={<Admin onLogout={handleLogout}><Documents /></Admin>}
//             />
//             <Route
//               path="/admin/faculty"
//               element={<Admin onLogout={handleLogout}><Faculty /></Admin>}
//             />
//             <Route
//               path="/admin/reports"
//               element={<Admin onLogout={handleLogout}><Reports /></Admin>}
//             />
//             <Route
//               path="/admin/students"
//               element={<Admin onLogout={handleLogout}><Students /></Admin>}
//             />
//             <Route
//               path="/admin/uploads"
//               element={<Admin onLogout={handleLogout}><Uploads /></Admin>}
//             />
//           </>
//         )}

//         {/* ---------------- ADVISOR / PROPONENT / RC placeholders (you can add pages) */}
//         {user?.is_advisor && (
//           <Route path="/advisor/*" element={<Advisor onLogout={handleLogout} />} />
//         )}
//         {user?.is_proponent && (
//           <Route path="/proponent/*" element={<Proponent onLogout={handleLogout} />} />
//         )}
//         {user?.is_research_coordinator && (
//           <Route path="/research-coordinator/*" element={<ResearchCoordinator onLogout={handleLogout} />} />
//         )}

//         {/* ---------------- VISITOR pages (each uses Visitor layout) ---------------- */}
//         <Route path="/dashboard" element={<Visitor onLogout={handleLogout}><UserDashboard /></Visitor>} />
//         <Route path="/profile" element={<Visitor onLogout={handleLogout}><Profile /></Visitor>} />
//         <Route path="/collaboration" element={<Visitor onLogout={handleLogout}><Collaboration /></Visitor>} />
//         <Route path="/favorite" element={<Visitor onLogout={handleLogout}><Favorite /></Visitor>} />
//         <Route path="/published" element={<Visitor onLogout={handleLogout}><Published /></Visitor>} />
//         <Route path="/download" element={<Visitor onLogout={handleLogout}><Download /></Visitor>} />
//         <Route path="/read" element={<Visitor onLogout={handleLogout}><Read /></Visitor>} />
//         <Route path="/citedpaper" element={<Visitor onLogout={handleLogout}><Citedpaper /></Visitor>} />
//         <Route path="/explore" element={<Visitor onLogout={handleLogout}><Explore /></Visitor>} />
//         <Route path="/setting" element={<Visitor onLogout={handleLogout}><Setting /></Visitor>} />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to={landing} replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;














// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Auth Components
// import Register from "./Register";
// import Login from "./Login";

// // Role-based Sidebars
// import Visitor from "./UserComponents/VisitorSidebar";
// import Admin from "./AdminComponents/AdminSidebar";
// import Advisor from "./AdvisorComponents/AdvisorDashboard";
// import Proponent from "./ProponentSidebar";
// import ResearchCoordinator from "./ResearchCoordinatorSidebar";

// axios.defaults.baseURL = "http://localhost:8000/api";

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//     const fetchMe = async () => {
//       try {
//         const res = await axios.get("/me");
//         setUser(res.data.user);
//       } catch (err) {
//         console.error("Fetch /me failed:", err.response?.data || err.message);
//         setUser(null);
//         localStorage.removeItem("token");
//         delete axios.defaults.headers.common["Authorization"];
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMe();
//   }, [token]);

//   const handleLogin = (data) => {
//     localStorage.setItem("token", data.token);
//     axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//     setToken(data.token);
//     setLoading(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     delete axios.defaults.headers.common["Authorization"];
//     setToken("");
//     setUser(null);
//   };

//   if (loading) return <p>Loading user info...</p>;

//   if (!token) {
//     return (
//       <div>
//         <h1>Welcome</h1>
//         <Register />
//         <Login onLogin={handleLogin} />
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <Routes>
//         {/* Each role sidebar gets mounted and handles its own nested routes */}
//         {user?.is_admin && (
//           <Route path="/admin/*" element={<Admin onLogout={handleLogout} />} />
//         )}
//         {user?.is_advisor && (
//           <Route path="/advisor/*" element={<Advisor onLogout={handleLogout} />} />
//         )}
//         {user?.is_proponent && (
//           <Route path="/proponent/*" element={<Proponent onLogout={handleLogout} />} />
//         )}
//         {user?.is_research_coordinator && (
//           <Route
//             path="/research-coordinator/*"
//             element={<ResearchCoordinator onLogout={handleLogout} />}
//           />
//         )}

//         {/* Fallback to Visitor if user has no special role */}
//         <Route path="/*" element={<Visitor onLogout={handleLogout} />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BrowserRouter as Router } from "react-router-dom";

// // Auth Components
// import Register from "./Register";
// import Login from "./Login";

// // Role-based Sidebars
// import Visitor from "./UserComponents/VisitorSidebar";
// import Admin from "./AdminComponents/AdminSidebar";
// import Advisor from "./AdvisorComponents/AdvisorSidebar";
// import Proponent from "./ProponentSidebar";
// import ResearchCoordinator from "./ResearchCoordinatorSidebar";

// axios.defaults.baseURL = "http://localhost:8000/api";

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//     const fetchMe = async () => {
//       try {
//         const res = await axios.get("/me");
//         setUser(res.data.user);
//       } catch (err) {
//         console.error("Fetch /me failed:", err.response?.data || err.message);
//         setUser(null);
//         localStorage.removeItem("token");
//         delete axios.defaults.headers.common["Authorization"];
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMe();
//   }, [token]);

//   const handleLogin = (data) => {
//     localStorage.setItem("token", data.token);
//     axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//     setToken(data.token);
//     setLoading(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     delete axios.defaults.headers.common["Authorization"];
//     setToken("");
//     setUser(null);
//   };

//   if (loading) return <p>Loading user info...</p>;

//   if (!token) {
//     return (
//       <div>
//         <h1>Welcome</h1>
//         <Register />
//         <Login onLogin={handleLogin} />
//       </div>
//     );
//   }

//   return (
//     <Router>
//       {user?.is_admin && <Admin onLogout={handleLogout} />}
//       {user?.is_advisor && <Advisor onLogout={handleLogout} />}
//       {user?.is_proponent && <Proponent onLogout={handleLogout} />}
//       {user?.is_research_coordinator && <ResearchCoordinator onLogout={handleLogout} />}
//       {!user?.is_admin &&
//         !user?.is_advisor &&
//         !user?.is_proponent &&
//         !user?.is_research_coordinator && <Visitor onLogout={handleLogout} />}
//     </Router>
//   );
// }

// export default App;

