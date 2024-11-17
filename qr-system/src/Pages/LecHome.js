import React from "react";
import '../Pages/LecHome.css';
import LecDash from "../components/LecView/LecDash";
import Sidebar from "../components/Sidebar";
import QRCodeGenerator from "../components/LecView/QRCodeGenerator"

function LecHome() {
    return (
        <div className="app-container">  {/* Flex container for sidebar and main content */}
          <div className="sidebar-container">  
            <Sidebar />  
          </div>
          <div className="main-content">  
            <LecDash />  
            <QRCodeGenerator/>
          </div>
        </div>
      );

}
export default LecHome;