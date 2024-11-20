import React, { useState } from "react";
import { FaPlus, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./StuSidebar.css";

const StuSidebar = ({ setClasses }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");

    // Redirect to the login page
    navigate("/login");
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();

    if (!courseId.trim()) {
      setMessage("Please enter a course ID.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/join-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          studentId: user?._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Successfully joined the class!");
        setCourseId(""); // Clear the input
        setShowJoinClassModal(false); // Close modal

        // Dynamically update classes
        setClasses((prevClasses) => [...prevClasses, data.newClass]);
      } else {
        setMessage(data.message || "Failed to join the class.");
      }
    } catch (error) {
      console.error("Error joining class:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-greeting">
          Hello, {user?.fname} {user?.lname} <div className="emoji">👋</div>
        </div>
      </nav>

      {/* Join Class Modal */}
      {showJoinClassModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Join Class</h2>
            <form onSubmit={handleJoinClass}>
              <label htmlFor="courseId">Enter Class ID:</label>
              <input
                type="text"
                id="courseId"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="Enter unique class ID"
                required
              />
              <button type="submit" className="btn-submit">
                Join
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowJoinClassModal(false)}
              >
                Cancel
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      )}

      {/* Sidebar Bottom Links */}
      <div className="sidebar-bottom">
        <button
          onClick={() => setShowJoinClassModal(true)}
          className="sidebar-link"
        >
          <FaPlus /> Join Class
        </button>
        <button className="sidebar-link" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default StuSidebar;
