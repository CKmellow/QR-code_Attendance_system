import React, { useState } from 'react';
import '../Pages/LecHome.css'; // Import LecHome specific CSS
import LecDash from "../components/LecView/LecDash";
import Sidebar from "../components/Sidebar"; // Sidebar component

function LecHome() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  // Toggle the sidebar visibility for mobile view
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar-container ${isSidebarVisible ? '' : 'hide'}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarVisible ? '' : 'expanded'}`}>
        <LecDash />
      </div>

      {/* Sidebar Toggle Button (Hamburger Icon) */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰ {/* Hamburger icon */}
      </button>
    </div>
  );
}

export default LecHome;
