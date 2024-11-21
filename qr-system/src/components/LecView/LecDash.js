import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LecDash.css';
import Loader from '../Loader';  // Assuming you have the Loader component implemented
import { toast } from 'sonner';

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
        const response = await fetch(`http://localhost:5000/lecturer/classes/${lecturerId}`);
        
        if (!response.ok) {
          // Handle case when no classes are found (404)
          if (response.status === 404) {
            setClasses([]); // Set classes to an empty array if no classes are found
            setError('No classes found for this lecturer.'); // Set a specific error message
            return;
          }
          throw new Error('Failed to fetch classes');
        }

        const data = await response.json();
        setClasses(data); // Set the fetched class data

      } catch (err) {
        setError(err.message); // Handle any other errors
      } finally {
        setLoading(false); // Ensure loading state is set to false after fetching
      }
    };

    fetchClasses(); // Call the fetchClasses function

  }, [lecturerId]); // Re-run when `lecturerId` changes

  const handleViewClass = (courseId) => {
    // Navigate to the class details page with the class ID
    navigate(`/class-details/lecturer/${courseId}`);
  };

  if (loading) return <Loader />;  // Show loader while data is fetching
  if (error) return <h1>No classes. Please add a class</h1>;  // Show error message if there's an error

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
