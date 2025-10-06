import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './StuDash.css';
import StuSidebar from './StuSidebar';
import Loader from '../Loader';

const StuDash = () => {
  const [classes, setClasses] = useState([]);
  const [attendancePercentages, setAttendancePercentages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const studentId = user ? user._id : null;

  useEffect(() => {
    if (!studentId) {
      setError('User not found');
      setLoading(false);
      return;
    }

    const fetchClasses = async () => {
      try {
        const response = await fetch(`https://qr-attendace-backend.onrender.com/student/classes/${studentId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setClasses([]); // Set empty array if no classes found
            setError("No classes found for this student.");
            return;
          }
          throw new Error('Failed to fetch classes');
        }

        const data = await response.json();
        setClasses(data);  // Set the fetched class data

        // Fetch attendance data for each class
        const attendancePromises = data.map((classItem) =>
          fetch(`https://qr-attendace-backend.onrender.com/class/details/student/${classItem._id}?studentId=${studentId}`)
            .then((res) => {
              if (!res.ok) {
                throw new Error(`Failed to fetch attendance for class ID: ${classItem._id}`);
              }
              return res.json();
            })
            .then((attendanceData) => ({
              classId: classItem._id,
              percentageAbsent: calculatePercentageAbsent(attendanceData.attendance),
            }))
            .catch((error) => {
              console.error(`Error fetching attendance for class ID ${classItem._id}:`, error);
              return { classId: classItem._id, percentageAbsent: null }; // Return fallback data in case of error
            })
        );

        const attendanceResults = await Promise.all(attendancePromises);

        // Create a mapping of classId to percentage absent
        const percentages = attendanceResults.reduce((acc, result) => {
          acc[result.classId] = result.percentageAbsent;
          return acc;
        }, {});

        setAttendancePercentages(percentages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [studentId]);

  const calculatePercentageAbsent = (attendance) => {
    const totalHours = attendance.reduce(
      (acc, record) => acc + record.hoursPresent + record.hoursAbsent,
      0
    );
    const totalAbsent = attendance.reduce((acc, record) => acc + record.hoursAbsent, 0);
    return totalHours === 0 ? 0 : ((totalAbsent / totalHours) * 100).toFixed(2);
  };

  if (loading) return <Loader />;
  if (error) return <h1>{error}</h1>;

  return (
    <div className="dashboard-container">
      <div className="dash">
        <h2>Classes</h2>
        <div className="class-grid">
          {classes.map((classItem) => (
            <div key={classItem._id} className="class-tile">
              <h3>{classItem.name || classItem.courseName}</h3>
              <p>
                Percentage Absent: {attendancePercentages[classItem._id] || "N/A"}%
              </p>
              <Link to={`/attendance/${classItem._id}`}>
                <button className="view-class-button">View Class</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StuDash;
