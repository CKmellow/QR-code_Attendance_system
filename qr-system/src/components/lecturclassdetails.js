import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.js'; // Import your Sidebar component
import './lecturerclassdetails.css';

const LecturerClassDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(null); // Tracks which student's details are being shown

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

  const calculatePercentageAbsent = (hoursPresent, hoursAbsent) => {
    const totalHours = hoursPresent + hoursAbsent;
    return totalHours === 0 ? 0 : ((hoursAbsent / totalHours) * 100).toFixed(2);
  };

  const openModal = (studentId) => {
    console.log("Opening modal for student:", studentId);
    setShowDetails(studentId);
  };

  const closeModal = () => {
    setShowDetails(null);
  };

  return (
    <div className="lecturer-class-details-container">
      <Sidebar /> 
      <div className="lecturer-class-details-content">
        <button className="back-button" onClick={() => navigate('/lec-home')}>
          Home
        </button>
        <button className='generate'>Generate QR Code</button>
        <h2>Class Details for {classDetails.courseName}</h2>
        <div>
          <h3>Course Information:</h3>
          <p><strong>Course ID:</strong> {classDetails.courseId}</p>
          <p><strong>Lecturer ID:</strong> {classDetails.lecturerId}</p>
          <p><strong>Number of Students:</strong> {classDetails.numOfStudents}</p>
        </div>

        {classDetails.students && classDetails.students.length > 0 ? (
          <div>
            <h3>Students Enrolled:</h3>
            <table border="1" cellPadding="10">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Hours Present</th>
                  <th>Hours Absent</th>
                  <th>Percentage Absent</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {classDetails.students.map((student, index) => {
                  const totalHoursPresent = student.attendance.reduce((sum, record) => sum + record.hoursPresent, 0);
                  const totalHoursAbsent = student.attendance.reduce((sum, record) => sum + record.hoursAbsent, 0);
                  const percentageAbsent = calculatePercentageAbsent(totalHoursPresent, totalHoursAbsent);

                  return (
                    <tr key={index}>
                      <td>{student.studentId}</td>
                      <td>{student.fname} {student.lname}</td>
                      <td>{totalHoursPresent}</td>
                      <td>{totalHoursAbsent}</td>
                      <td>{percentageAbsent}%</td>
                      <td>
                        <button className='details' onClick={() => openModal(student.studentId)}>View Details</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No students enrolled in this class.</p>
        )}
      </div>

      {showDetails && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>x</button>
            <h4>Attendance Details for {classDetails.students.find(s => s.studentId === showDetails)?.fname}</h4>
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Attendance Date</th>
                  <th>Class Start Time</th>
                  <th>Status</th>
                  <th>Hours Present</th>
                  <th>Hours Absent</th>
                </tr>
              </thead>
              <tbody>
                {classDetails.students.find(s => s.studentId === showDetails)?.attendance.map((record, idx) => (
                  <tr key={idx}>
                    <td>{record.attendanceDate}</td>
                    <td>{record.classStartTime}</td>
                    <td>{record.status}</td>
                    <td>{record.hoursPresent}</td>
                    <td>{record.hoursAbsent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerClassDetails;
