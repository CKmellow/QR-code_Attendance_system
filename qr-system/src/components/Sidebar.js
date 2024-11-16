// components/Sidebar.js
import React from 'react';
import { FaTachometerAlt, FaShoppingCart, FaChartBar, FaBoxes, FaTag, FaPlus, FaUser } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {

  const user = JSON.parse(localStorage.getItem('user'));
  return (

    <div className="sidebar">
            <nav className="sidebar-nav">
                {/* Display the user's name */}
                <div className="sidebar-greeting">
                    Hello, {user?.fname} {user?.lname}
                </div>
            </nav>

            {/* Add Class and Profile links at the bottom */}
            <div className="sidebar-bottom">
                <a href="#" className="sidebar-link">
                    <FaPlus /> Add Class
                </a>
                <a href="#" className="sidebar-link">
                    <FaUser /> Profile
                </a>
            </div>
        </div>
  );
};

export default Sidebar;
