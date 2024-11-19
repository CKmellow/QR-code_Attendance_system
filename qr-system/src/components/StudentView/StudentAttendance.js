import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StuSidebar from './StuSidebar';
import { QrReader } from 'react-qr-reader';
import './StudentAttendance.css';

const StudentAttendance = () => {
  const { courseId } = useParams();
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState('');
  const [qrOpen, setQrOpen] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const studentId = JSON.parse(localStorage.getItem('user'))?._id;
        if (!studentId) {
          setError('Student ID not found. Please log in.');
          return;
        }

        const response = await axios.get(`/class/details/student/${courseId}`, {
          params: { studentId },
        });
        setAttendanceData(response.data);
      } catch (err) {
        setError('Failed to load attendance data.');
        console.error(err);
      }
    };

    fetchAttendance();
  }, [courseId]);

  const handleScan = async (data) => {
    if (data) {
      try {
        const student = JSON.parse(localStorage.getItem('user'));
        if (!student) {
          setError('Invalid scan. Please log in and try again.');
          return;
        }

        const response = await axios.post('/attendance/record', {
          qrData: data,
          studentId: student._id,
          courseId,
        });

        // Assuming response contains className, date, time, and duration
        const { className, date, time, duration } = response.data;

        alert(`Attendance recorded for ${className} on ${date} at ${time} for ${duration}`);
        
        // Send email notification
        await axios.post('/send-email', {
          to: student.email,
          subject: 'Attendance Confirmation',
          text: `Your attendance for ${className} on ${date} at ${time} for ${duration} has been recorded.`,
        });

        setQrOpen(false);
      } catch (err) {
        setError('Failed to record attendance. Please try again.');
        console.error(err);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('QR Code scan failed. Please try again.');
  };

  const calculatePercentageAbsent = (attendance) => {
    const totalHours = attendance.reduce(
      (acc, record) => acc + record.hoursPresent + record.hoursAbsent,
      0
    );
    const totalAbsent = attendance.reduce((acc, record) => acc + record.hoursAbsent, 0);
    return totalHours === 0 ? 0 : ((totalAbsent / totalHours) * 100).toFixed(2);
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!attendanceData) return <div className="loading-message">Loading...</div>;

  const percentageAbsent = calculatePercentageAbsent(attendanceData.attendance);

  return (
    <div className="student-attendance-container">
      <div className="stu-sidebar">
        <StuSidebar />
      </div>

      <div className="attendance-main-content">
        <div className="attendance-header">
          <button className="back-button" onClick={() => navigate('/stu-home')}>
            Home
          </button>
          <button className="scan-button" onClick={() => setQrOpen(true)}>
            Scan QR Code
          </button>
          <h1>Attendance for {attendanceData.studentName}</h1>
          <h2>Course: {attendanceData.courseName}</h2>
          <h3>Percentage Absent: {percentageAbsent}%</h3>
        </div>

        {qrOpen && (
          <div className="qr-scanner">
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: 'environment' }}
              onError={handleError}
              style={{ width: '300px' }}
            />
            <button
              className="close-scanner-button"
              onClick={() => setQrOpen(false)}
            >
              Close Scanner
            </button>
          </div>
        )}

        <div className="attendance-table-container">
          <table>
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
      </div>
    </div>
  );
};

export default StudentAttendance;
