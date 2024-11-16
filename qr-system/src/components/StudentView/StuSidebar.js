// components/Sidebar.js
import React from 'react';
import { FaTachometerAlt, FaShoppingCart, FaChartBar, FaBoxes, FaTag, FaPlus, FaUser } from 'react-icons/fa';
import './StuSidebar.css';

const StuSidebar = () => {
  return (
    <div className="sidebar">
    
      <nav className="sidebar-nav">
        <a href="#" className="sidebar-link">
        Dashboard
        </a>
        {/* <a href="#" className="sidebar-link">
          <FaShoppingCart /> Order
        </a>
        <a href="#" className="sidebar-link">
          <FaChartBar /> Statistic
        </a>
        <a href="#" className="sidebar-link">
          <FaBoxes /> Product
        </a>
        <a href="#" className="sidebar-link">
          <FaTag /> Offer
        </a> */}
      </nav>

      {/* Add Class and Profile links at the bottom */}
      <div className="sidebar-bottom">
        <a href="#" className="sidebar-link">
          <FaPlus /> Join Class
        </a>
        <a href="#" className="sidebar-link">
          <FaUser /> Profile
        </a>
      </div>
    </div>
  );
};

export default StuSidebar;
