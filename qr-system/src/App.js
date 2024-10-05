// src/App.js
import React from 'react';
import Sidebar from './components/Sidebar';
import LecDash from './components/LecView/LecDash';  // Import LecDash component

function App() {
  return (
    <div className="app-container">  {/* Flex container for sidebar and main content */}
      <Sidebar />  {/* Sidebar will stay on the left */}
      
      {/* Main content should appear next to the sidebar */}
      <div className="main-content">  
        <LecDash />  {/* Dashboard content here */}
      </div>
    </div>
  );
}

export default App;
