// src/components/LecView/LecDash.js
import React from 'react';
import './LecDash.css';  // Link to CSS file for LecDash
import './LecAttendance.js';

const classes = [
  { id: 1, name: 'Math 101', students: 25 },
  { id: 2, name: 'History 201', students: 30 },
  { id: 3, name: 'Physics 301', students: 20 },
  { id: 4, name: 'Chemistry 101', students: 28 },
  { id: 5, name: 'Biology 201', students: 22 },
  { id: 6, name: 'English Literature 101', students: 18 },
  { id: 7, name: 'Computer Science 101', students: 35 },
  { id: 8, name: 'Philosophy 101', students: 15 },
  { id: 9, name: 'Art History 101', students: 12 },
  { id: 10, name: 'Sociology 101', students: 24 },
  { id: 11, name: 'Economics 301', students: 40 },
  { id: 12, name: 'Environmental Science 101', students: 20 },
];  // More example class data

const LecDash = () => {
  return (
    <div className="dashboard-container">
      <div className="dash">
      <h2>Dashboard</h2>
      </div>
      
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
