import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { IoMdQrScanner } from 'react-icons/io';
import StuSidebar from '../components/StudentView/StuSidebar';
import './StudentAttendance.css';

const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch attendance data here
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch('/api/attendance');
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const calculatePercentageAbsent = (attendance) => {
    const totalHours = attendance.reduce(
      (acc, record) => acc + record.hoursPresent + record.hoursAbsent,
      0
    );
    const totalAbsent = attendance.reduce((acc, record) => acc + record.hoursAbsent, 0);
    return totalHours === 0 ? 0 : ((totalAbsent / totalHours) * 100).toFixed(2);
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const percentageAbsent = calculatePercentageAbsent(attendanceData?.attendance);

  return (
    <div className="student-attendance-container">
      <div className={`stu-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-toggle-button" onClick={toggleSidebar}>
          ☰
        </button>
        <StuSidebar />
      </div>
      <div className="attendance-main-content">
        <div className="attendance-header">
          <button className="back-button" onClick={() => navigate('/stu-home')}>
            <FaHome style={{ color: 'black', fontSize: '2rem' }} />
          </button>
          <button className="scan-button" onClick={() => setQrModalOpen(true)}>
            <IoMdQrScanner style={{ color: 'black', fontSize: '2rem' }} />
          </button>
          <h1>Attendance for {attendanceData?.studentName}</h1>
          <h2>Course: {attendanceData?.courseName}</h2>
          <h3>Percentage Absent: {percentageAbsent}%</h3>
        </div>
        <div className="attendance-details">
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
              {attendanceData?.attendance.map((record, index) => (
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

      {qrModalOpen && (
        <div className="qr-scanner-modal">
          <div className="qr-scanner-content">
            <button onClick={() => setQrModalOpen(false)} className="close-modal-button">x</button>
            <h2>Scan QR Code</h2>
            <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
            {scanError && <p style={{ color: 'red' }}>{scanError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
