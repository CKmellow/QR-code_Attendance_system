import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './StuDash.css';
import StuSidebar from './StuSidebar';

const StuDash = () => {
  const [classes, setClasses] = useState([]);
  const [attendancePercentages, setAttendancePercentages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const studentId = user._id;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/student/classes/${studentId}`);
        if (!response.ok) throw new Error('Failed to fetch classes');

        const data = await response.json();
        setClasses(data);

        // Fetch attendance data for each class
        const attendancePromises = data.map((classItem) =>
          fetch(`http://localhost:5000/class/details/student/${classItem._id}?studentId=${studentId}`)
            .then((res) => res.json())
            .then((attendanceData) => ({
              classId: classItem._id,
              percentageAbsent: calculatePercentageAbsent(attendanceData.attendance),
            }))
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

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <StuSidebar />
      <div className="dash">
        <h2>Classes</h2>
      </div>
      <div className="class-grid">
        {classes.map((classItem) => (
          <div key={classItem._id} className="class-tile">
            <h3>{classItem.name || classItem.courseName}</h3>
            <p>Percentage Absent: {attendancePercentages[classItem._id] || 'N/A'}%</p>
            <Link to={`/attendance/${classItem._id}`}>
              <button className="view-class-button">View Class</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StuDash;
