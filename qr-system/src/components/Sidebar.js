import React, { useState } from 'react';
import { FaTachometerAlt, FaPlus, FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import './Sidebar.css';
import { toast } from 'sonner';

const Sidebar = () => {
  const [className, setClassName] = useState('');
  const [showAddClassForm, setShowAddClassForm] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");

    // Redirect to the login page
    navigate("/login"); // Use React Router's navigate
  };


  const handleAddClass = async (e) => {
    e.preventDefault();
  
    if (!className.trim()) {
      alert("Please enter a class name");
      return;
    }
  
    // Get the logged-in lecturer's ID
    const lecturerId = user?._id;
    if (!lecturerId) {
      alert("Unable to fetch lecturer ID. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/add-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName: className,
          lecturerId: lecturerId,
        }), 
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // alert(data.message || "Class added successfully!");
        toast.success(data.message || "Class added successfully!");
        setClassName(""); // Assuming setClassName is a state setter for className
        setShowAddClassForm(false); // Assuming setShowAddClassForm is a state setter for showing the form
      } else {
        // alert(data.message || "Failed to add class");
        toast.error(data.message || "Failed to add class");
      }
    } catch (error) {
      console.error("Error adding class:", error);
      alert("Server error. Please try again later.");
    }
  };
  
  

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        {/* Display the user's name */}
        <div className="sidebar-greeting">
        Hello, {user?.fname} {user?.lname} <div className="emoji">👋</div>
        </div>

        <button className="sidebar-link">
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
        <button className="sidebar-link " onClick={handleLogout}>
           Logout
        </button>
      </div>

      {showAddClassForm && (
  <>
    <div className="add-class-form-backdrop" onClick={() => setShowAddClassForm(false)}></div>
    <div className="add-class-form-container">
      <form className="add-class-form" onSubmit={handleAddClass}>
        <h2>Add a New Class</h2>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Enter class name(required)"
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
  </>
)}

    </div>
  );
};

export default Sidebar;
