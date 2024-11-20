import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QrReader from 'react-qr-scanner'; // Import QR scanner
import StuSidebar from './StuSidebar';
import './StudentAttendance.css';
import { toast } from 'sonner';

const StudentAttendance = () => {
  const { courseId } = useParams();
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState('');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [scanError, setScanError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const studentId = JSON.parse(localStorage.getItem('user'))?._id;
        if (!studentId) {
          setError("Student ID not found. Please log in.");
          toast.error("Student ID not found. Please log in.");
          return;
        }

        const response = await axios.get(`/class/details/student/${courseId}`, {
          params: { studentId },
        });
        setAttendanceData(response.data);
      } catch (err) {
        setError("Failed to load attendance data.");
        toast.error("Failed to load attendance data.");
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

  const [isScanning, setIsScanning] = useState(false); // Add a scanning state

  const handleScan = async (data) => {
    if (data && !isScanning) { // Ensure scanning only happens if not already processing
      setIsScanning(true); // Set scanning state to true
      console.log("Raw QR Data:", data);
      try {
        // Extract the text property from the scanned data
        const qrDataText = data.text;
  
        // Parse the text property as JSON
        const qrData = JSON.parse(qrDataText);
        console.log("Parsed QR Data:", qrData);
  
        // Validate QR data structure
        if (!qrData.courseId || !qrData.date || !qrData.startTime || !qrData.duration) {
          setScanError('Invalid QR code data.');
          toast.error('Invalid QR code data.');
          setIsScanning(false); // Reset scanning state
          return;
        }
  
        if (qrData.courseId !== courseId) {
          setScanError('Invalid QR code for this course.');
          toast.error('Invalid QR code data.');
          setIsScanning(false); // Reset scanning state
          return;
        }
  
        const studentId = JSON.parse(localStorage.getItem('user'))?._id;
        if (!studentId) {
          setScanError('Student ID not found. Please log in.');
          toast.error('Student ID not found. Please log in.');
          setIsScanning(false); // Reset scanning state
          return;
        }
  
        // Send request to backend
        const response = await axios.post('/attendance/update', {
          studentId,
          courseId: qrData.courseId,
          attendanceDate: qrData.date,
          classStartTime: qrData.startTime,
          duration: qrData.duration,
        });
  
        console.log('Attendance updated:', response.data);
        toast.success('Attendance updated successfully.');
  
        // Close the QR modal after successful scan and update
        setQrModalOpen(false);
  
        // Clear scan error in case of successful scan
        setScanError('');
      } catch (error) {
        console.error('Error updating attendance:', error.response?.data || error.message);
        setScanError('Failed to update attendance. Try again.');
        toast.error('Failed to update attendance. Try again.');
      } finally {
        setIsScanning(false); // Reset scanning state after completion
      }
    }
  };
 

  
  


  const handleError = (err) => {
    console.error(err);
    setScanError('Camera error. Please allow camera permissions and try again.');
    toast.error('Camera error. Please allow camera permissions and try again.');
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!attendanceData) return <div className="loading-message">Loading...</div>;

  const percentageAbsent = calculatePercentageAbsent(attendanceData.attendance);

  return (
    <div className="student-attendance-container">
      <div className='stu-sidebar'> <StuSidebar /></div>
      <div className="attendance-main-content">
        <div className="attendance-header">
          <button className="back-button" onClick={() => navigate('/stu-home')}>
            Home
          </button>
          <button className="scan-button" onClick={() => setQrModalOpen(true)}>
            Scan QR Code
          </button>
          <h1>Attendance for {attendanceData.studentName}</h1>
          <h2>Course: {attendanceData.courseName}</h2>
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

      {/* QR Scanner Modal */}
      {qrModalOpen && (
        <div className="qr-scanner-modal">
        <div className="qr-scanner-content">
          <button onClick={() => setQrModalOpen(false)} className="close-modal-button">Close</button>
          <h2>Scan QR Code</h2>
          <div className={`qr-reader-container ${scanError ? 'error' : 'success'}`}>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />
          </div>
          {scanError && <p style={{ color: 'red' }}>{scanError}</p>}
        </div>
      </div>
      
      )}
    </div>
  );
};

export default StudentAttendance;