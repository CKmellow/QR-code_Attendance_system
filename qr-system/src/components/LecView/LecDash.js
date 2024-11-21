import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LecDash.css';

const LecDash = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const lecturerId = user._id; 
  console.log(`Lecturer ID received: ${lecturerId}`);

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`https://qr-attendace-backend.onrender.com/lecturer/classes/${lecturerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [lecturerId]);

  const handleViewClass = (courseId) => {
    // Navigate to the class details page with the class ID
    navigate(`/class-details/lecturer/${courseId}`);
  };

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <div className="dash">
        <h2>Classes</h2>
      </div>
      <div className="class-grid">
        {classes.map((classItem) => (
          <div key={classItem._id} className="class-tile">
            <h3>{classItem.name || classItem.courseName}</h3>
            <p>Students: {classItem.studentCount || classItem.numOfStudents || 'N/A'}</p>
            <button className="view-class-button" onClick={() => handleViewClass(classItem._id)}>View Class</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecDash;
