import React from "react";
import backgroundPng from "./assets/background.png";
import logo1 from "./assets/logo1.png"; // 677 x 593
import logo2 from "./assets/logo2.png"; // 625 x 594
import "./index.css"; 

function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundPng})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: "'Merriweather','Times New Roman',serif",
        color: "#0b2f4a",
        position: "relative",
      }}
    >
  
      <nav
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "14rem", 
          display: "flex",
          gap: "2rem",
          fontSize: "1.4rem",
          fontWeight: "600",
        }}
      >
        <a href="#login" className="nav-link">
          Login
        </a>
        <a href="#register" className="nav-link">
          Register
        </a>
        <a href="#contact" className="nav-link">
          Contact
        </a>
      </nav>

    
      <div
        style={{
          marginLeft: "20%",
          textAlign: "center",
        }}
      >
     
        <h1
          style={{
            gap: "1rem",
            margin: 0,
            fontSize: "5rem",
            fontFamily: "Algerian, serif",
          }}
        >
          OPOL COMMUNITY COLLEGE
        </h1>

        <h2
          style={{
            margin: "0.8rem 0 3.5rem 0",
            fontWeight: 700,
            color: "#0d5490",
            fontSize: "2.5rem",
          }}
        >
          Research Repository and Archives 
        </h2>

        <div
          style={{
            display: "flex",
            gap: "4rem",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <img src={logo1} alt="Library Logo" style={{ height: 300, width: "auto" }} />
          <img src={logo2} alt="College Logo" style={{ height: 300, width: "auto" }} />
        </div>

        <p style={{ fontSize: "1.5rem", lineHeight: 1.6 }}>
          "Preserving Academic Excellence. Sharing Knowledge."
        </p>
      </div>
    </div>
  );
}

export default App;
