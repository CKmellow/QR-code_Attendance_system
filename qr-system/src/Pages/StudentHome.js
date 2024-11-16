import React from "react";
import '../Pages/LecHome.css';
import Stusidebar from "../components/StudentView/StuSidebar";
import Studash from "../components/StudentView/StudentDash";

function StudentHome() {
    return (
        <div className="app-container">  {/* Flex container for sidebar and main content */}
          <div className="sidebar-container">  
            <Stusidebar />  
          </div>
          <div className="main-content">  
            <Studash/>  
          </div>
        </div>
      );

}
export default StudentHome;