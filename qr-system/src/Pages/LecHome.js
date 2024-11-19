import React, { useState } from "react";
import '../Pages/LecHome.css';
import LecDash from "../components/LecView/LecDash";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";

function LecHome() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="app-container">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className={`sidebar-container ${isSidebarVisible ? "" : "hidden"}`}>
        <Sidebar />
      </div>
      <div className="main-content">
        <LecDash />
      </div>
    </div>
  );
}

export default LecHome;
