// components/Topbar.js
import React from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import './Topbar.css';

const Topbar = () => {
  return (
    <div className="topbar">
      {/* Left side - Search bar */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search"
          className="search-input"
        />
      </div>

      {/* Right side - Icons */}
      <div className="topbar-icons">
        <FaBell className="icon" />
        <FaUserCircle className="icon" />
      </div>
    </div>
  );
};

export default Topbar;
