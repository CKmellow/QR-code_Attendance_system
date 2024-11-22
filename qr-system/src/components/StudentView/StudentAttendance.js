import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QrReader from 'react-qr-scanner';
import StuSidebar from './StuSidebar';
import './StudentAttendance.css';
import { toast } from 'sonner';
import { FaHome } from 'react-icons/fa';
import { IoMdQrScanner } from 'react-icons/io';

const StudentAttendance = () => {
  const { courseId } = useParams();
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState('');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scannedQRCodes, setScannedQRCodes] = useState(new Set());
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const studentId = JSON.parse(localStorage.getItem('user'))?._id;
        if (!studentId) {
          throw new Error('Student ID not found. Please log in.');
        }

        const response = await axios.get(`/class/details/student/${courseId}`, {
          params: { studentId },
        });
        setAttendanceData(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load attendance data.');
        toast.error(err.message || 'Failed to load attendance data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [courseId]);

  const calculatePercentageAbsent = (attendance) => {
    if (!attendance || attendance.length === 0) return 0;
    const totalHours = attendance.reduce(
      (acc, record) => acc + record.hoursPresent + record.hoursAbsent,
      0
    );
    const totalAbsent = attendance.reduce((acc, record) => acc + record.hoursAbsent, 0);
    return totalHours === 0 ? 0 : ((totalAbsent / totalHours) * 100).toFixed(2);
  };

  const handleScan = async (data) => {
    if (data && !isScanning) {
      setIsScanning(true);
      try {
        const qrDataText = data.text;
        const qrData = JSON.parse(qrDataText);

        // Validate QR structure
        if (!qrData.courseId || !qrData.date || !qrData.startTime || !qrData.duration || !qrData.expiry) {
          throw new Error('Invalid QR code data.');
        }

        // Prevent duplicate scanning
        if (scannedQRCodes.has(qrDataText)) {
          throw new Error('This QR code has already been scanned.');
        }

        // Check QR expiry
        const currentTime = Date.now();
        const expiryTime = new Date(qrData.expiry).getTime();
        if (currentTime > expiryTime) {
          throw new Error('QR code has expired.');
        }

        if (qrData.courseId !== courseId) {
          throw new Error('Invalid QR code for this course.');
        }

        const studentId = JSON.parse(localStorage.getItem('user'))?._id;
        if (!studentId) {
          throw new Error('Student ID not found. Please log in.');
        }

        // Update attendance
        const response = await axios.post('/attendance/update', {
          studentId,
          courseId: qrData.courseId,
          attendanceDate: qrData.date,
          classStartTime: qrData.startTime,
          duration: qrData.duration,
        });

        toast.success('Attendance updated successfully.');
        setScannedQRCodes((prev) => new Set(prev).add(qrDataText));
        setQrModalOpen(false);
      } catch (err) {
        setScanError(err.message || 'Failed to update attendance.');
        toast.error(err.message || 'Failed to update attendance.');
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleError = (err) => {
    setScanError('Camera error. Please allow camera permissions and try again.');
    toast.error('Camera error. Please allow camera permissions and try again.');
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const percentageAbsent = calculatePercentageAbsent(attendanceData?.attendance);

  return (
    <div className="student-attendance-container">
      <div className={`sidebar-container ${!isSidebarOpen ? 'hide' : ''}`}>
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
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              facingMode="environment"  // Ensures the back camera is used
              style={{ width: '100%' }}
            />
            {scanError && <p style={{ color: 'red' }}>{scanError}</p>}
          </div>
        </div>
      )}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
    </div>
  );
};

export default StudentAttendance;
