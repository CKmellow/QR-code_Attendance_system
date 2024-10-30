// src/components/LecView/LecDash.js
import React, { useState, useEffect } from 'react';
import './LecDash.css';  // Link to CSS file for LecDash
import AttendanceView from './AttendanceView'; // Import the new AttendanceView component

const LecDash = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null); // To hold the selected class
  const [viewingAttendance, setViewingAttendance] = useState(false); // To control viewing state

  // Example class data
  const classes = [
    { id: 1, name: 'Math 101' },
    { id: 2, name: 'History 201' },
    { id: 3, name: 'Physics 301' },
    { id: 4, name: 'Chemistry 101' },
    { id: 5, name: 'Biology 201' },
    { id: 6, name: 'English Literature 101' },
    { id: 7, name: 'Computer Science 101' },
    { id: 8, name: 'Philosophy 101' },
    { id: 9, name: 'Art History 101' },
    { id: 10, name: 'Sociology 101' },
    { id: 11, name: 'Economics 301' },
    { id: 12, name: 'Environmental Science 101' },
  ];

  // Fetch attendance data when the component mounts
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('/api/attendance'); // Adjust to your API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const handleViewClass = (classId) => {
    setSelectedClass(classId);
    setViewingAttendance(true);
  };

  if (loading) {
    return <div>Loading attendance data...</div>;
  }

  if (error) {
    return <div>Error fetching attendance data: {error}</div>;
  }

  if (viewingAttendance) {
    const classAttendance = attendanceData.filter(student => student.classId === selectedClass);
    const className = classes.find(classItem => classItem.id === selectedClass)?.name;

    return (
      <AttendanceView className={className} attendanceData={classAttendance} />
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dash">
        <h2>Dashboard</h2>
      </div>
      
      <div className="class-grid">
        {classes.map((classItem) => (
          <div key={classItem.id} className="class-tile">
            <h3>{classItem.name}</h3>
            <p>Students: {attendanceData.filter(student => student.classId === classItem.id).length}</p>
            <button className="view-class-button" onClick={() => handleViewClass(classItem.id)}>
              View Class
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecDash;
