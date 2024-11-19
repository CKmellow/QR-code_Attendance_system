import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StuSidebar from './StuSidebar';

const StudentAttendance = () => {
  const { courseId } = useParams();
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const studentId = JSON.parse(localStorage.getItem('user'))?._id;
        if (!studentId) {
          setError("Student ID not found. Please log in.");
          return;
        }

        const response = await axios.get(`/class/details/student/${courseId}`, {
          params: { studentId },
        });
        setAttendanceData(response.data);
      } catch (err) {
        setError("Failed to load attendance data.");
        console.error(err);
      }
    };

    fetchAttendance();
  }, [courseId]);

  const calculatePercentageAbsent = (attendance) => {
    const totalHours = attendance.reduce(
      (acc, record) => acc + record.hoursPresent + record.hoursAbsent,
      0
    );
    const totalAbsent = attendance.reduce((acc, record) => acc + record.hoursAbsent, 0);
    return totalHours === 0 ? 0 : ((totalAbsent / totalHours) * 100).toFixed(2);
  };

  if (error) return <p>{error}</p>;
  if (!attendanceData) return <p>Loading...</p>;

  const percentageAbsent = calculatePercentageAbsent(attendanceData.attendance);

  return (
    <div>
      <StuSidebar />
      <button className="back-button" onClick={() => navigate('/stu-home')}>Home</button>
      <button className="scan">Scan QR Code</button>
      <h1>Attendance for {attendanceData.studentName}</h1>
      <h2>Course: {attendanceData.courseName}</h2>
      <h3>Percentage Absent: {percentageAbsent}%</h3>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>Status</th>
            <th>Hours Present</th>
            <th>Hours Absent</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.attendance.map((record, index) => (
            <tr key={index}>
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
  );
};

export default StudentAttendance;
