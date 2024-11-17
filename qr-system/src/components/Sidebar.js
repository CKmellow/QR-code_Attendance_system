import React, { useState } from 'react';
import { FaTachometerAlt, FaPlus, FaUser } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [className, setClassName] = useState('');
  const [showAddClassForm, setShowAddClassForm] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const handleAddClass = async (e) => {
    e.preventDefault();

    if (!className.trim()) {
      alert('Please enter a class name');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/add-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ className, instructorId: 'instructor123' }), // Replace with actual instructor ID
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setClassName('');
        setShowAddClassForm(false);
      } else {
        alert(data.message || 'Failed to add class');
      }
    } catch (error) {
      console.error('Error adding class:', error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        {/* Display the user's name */}
        <div className="sidebar-greeting">
          Hello, {user?.fname} {user?.lname} 👋
        </div>

        <button className="sidebar-link">
          <FaTachometerAlt /> Dashboard
        </button>
      </nav>

      {/* Add Class and Profile links at the bottom */}
      <div className="sidebar-bottom">
        <button
          className="sidebar-link"
          onClick={() => setShowAddClassForm(!showAddClassForm)}
        >
          <FaPlus /> Add Class
        </button>
        <button className="sidebar-link">
          <FaUser /> Profile
        </button>
      </div>

      {showAddClassForm && (
        <div className="add-class-form-container">
          <form className="add-class-form" onSubmit={handleAddClass}>
            <h2>Add a New Class</h2>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter class name"
              required
            />
            <button type="submit">Submit</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowAddClassForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
