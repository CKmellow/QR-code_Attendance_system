import React from 'react';
import Sidebar from './components/Sidebar';
import LecDash from './components/LecView/LecDash';  // Import LecDash component

function App() {
  return (
    <div className="app-container">  {/* Flex container for sidebar and main content */}
      <div className="sidebar-container">  
        <Sidebar />  
      </div>
      <div className="main-content">  
        <LecDash />  
      </div>
    </div>
  );
}

export default App;
