import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const LecturerClassDetails = () => {
  const { courseId } = useParams(); 
  console.log("Course ID from URL: ", courseId);// This will grab the courseId from the URL
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/class/details/lecturer/${courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch class details');
        }
        const data = await response.json();
        setClassDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchClassDetails();
    } else {
      setError('Course ID is missing');
      setLoading(false);
    }
  }, [courseId]);

  if (loading) return <p>Loading class details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Class Details</h2>
      {/* Render class details here */}
      <pre>{JSON.stringify(classDetails, null, 2)}</pre>
    </div>
  );
};

export default LecturerClassDetails;
