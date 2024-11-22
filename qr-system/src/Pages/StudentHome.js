import React, { useState } from "react";
import "../Pages/LecHome.css"; // Reusing LecHome's CSS
import Stusidebar from "../components/StudentView/StuSidebar";
import Studash from "../components/StudentView/StudentDash";
import "./StudentHome.css"; // For any specific tweaks

function StudentHome() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [classes, setClasses] = useState([]); // Define state for classes

  // Toggle the sidebar visibility for mobile view
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="app-container">
      
      <div className={`sidebar-container ${isSidebarVisible ? "" : "hide"}`}>
      <Stusidebar setClasses={setClasses} /> {/* Pass setClasses to StuSidebar */}
      </div>
      {/* Main Content */}
      <div className="main-content">
        <Studash classes={classes} setClasses={setClasses} /> {/* Pass classes and setClasses to Studash */}
      </div>

      {/* Sidebar Toggle Button (Hamburger Icon) */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰ {/* Hamburger icon */}
      </button>
    </div>
  );
}

export default StudentHome;
