import React, { useEffect, useState } from 'react';
import './LecDash.css';

const LecDash = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const lecturerId = user._id; 
  console.log(`Lecturer ID received: ${lecturerId}`);


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Make sure to correctly use the template literal with backticks
        const response = await fetch(`http://localhost:5000/lecturer/classes/${lecturerId}`);
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
            <button className="view-class-button">View Class</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecDash;
