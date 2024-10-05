// src/components/LecView/LecDash.js
import React from 'react';
import './LecDash.css';  // Link to CSS file for LecDash

const classes = [
  { id: 1, name: 'Math 101', students: 25 },
  { id: 2, name: 'History 201', students: 30 },
  { id: 3, name: 'Physics 301', students: 20 },
  { id: 4, name: 'Chemistry 101', students: 28 },
];  // Example class data

const LecDash = () => {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="class-grid">
        {classes.map((classItem) => (
          <div key={classItem.id} className="class-tile">
            <h3>{classItem.name}</h3>
            <p>Students: {classItem.students}</p>
            <button className="view-class-button">View Class</button>  {/* Handle navigation */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecDash;
