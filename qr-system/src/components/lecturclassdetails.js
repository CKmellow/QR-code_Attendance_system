import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.js'; // Import your Sidebar component
import { QRCodeSVG } from 'qrcode.react'; // Import the SVG-based QR code generator
import './lecturerclassdetails.css';
import {
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
} from 'react-icons/ai'; // Import necessary icons
import { FaHome, FaQrcode } from 'react-icons/fa';
import Loader from './Loader.js';

const LecturerClassDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false); // Manage QR modal
  const [qrDetails, setQrDetails] = useState({ date: '', startTime: '', duration: '', expirationTime: 10 });
  const [generatedQrData, setGeneratedQrData] = useState(null);
  const [showDetails, setShowDetails] = useState(null); // Tracks which student's details are being shown
  const [qrZoom, setQrZoom] = useState(256); // Default QR code size
  const [qrFullScreen, setQrFullScreen] = useState(false);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(`https://qr-attendace-backend.onrender.com/class/details/lecturer/${courseId}`);
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

  const calculatePercentageAbsent = (hoursPresent, hoursAbsent) => {
    const totalHours = hoursPresent + hoursAbsent;
    return totalHours === 0 ? 0 : ((hoursAbsent / totalHours) * 100).toFixed(2);
  };

  const handleQrInputChange = (e) => {
    const { name, value } = e.target;
    setQrDetails({ ...qrDetails, [name]: value });
  };

  const handleGenerateQr = () => {
    const { date, startTime, duration, expirationTime } = qrDetails;
    if (!date || !startTime || !duration) {
      alert('Please fill in all the fields.');
      return;
    }

    // Calculate expiration timestamp
    const now = new Date();
    const expirationMinutes = expirationTime ? parseInt(expirationTime, 10) : 10; // Default 10 minutes
    const expirationTimestamp = new Date(now.getTime() + expirationMinutes * 60000);

    // Include expiration timestamp in QR data
    const qrData = { courseId, date, startTime, duration, expirationTimestamp: expirationTimestamp.toISOString() };
    setGeneratedQrData(qrData); // Pass data for QR generation
    setQrModalOpen(false);
  };

  const openModal = (studentId) => setShowDetails(studentId);
  const closeModal = () => setShowDetails(null);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="lecturer-class-details-container">
      <Sidebar />
      {/* Top navigation bar */}
      <div className="top-bar">
        <button className="home-icon" title="Home" onClick={() => navigate('/lec-home')}>
          <FaHome size={24} />
        </button>

        <button className="generate-icon" title="Generate QR Code" onClick={() => setQrModalOpen(true)}>
          <FaQrcode size={24} />
        </button>
      </div>

      <div className="lecturer-class-details-content">
        <h2>Class Details for {classDetails.courseName}</h2>
        <div>
          <h3>Course Information:</h3>
          <p>
            <strong>Course ID:</strong> {classDetails.courseId}
          </p>
          <p>
            <strong>Lecturer ID:</strong> {classDetails.lecturerId}
          </p>
          <p>
            <strong>Number of Students:</strong> {classDetails.numOfStudents}
          </p>
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
                      <td>
                        {student.fname} {student.lname}
                      </td>
                      <td>{totalHoursPresent}</td>
                      <td>{totalHoursAbsent}</td>
                      <td>{percentageAbsent}%</td>
                      <td>
                        <button className="details" onClick={() => openModal(student.studentId)}>
                          View Details
                        </button>
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

      {/* QR Modal */}
      {qrModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setQrModalOpen(false)}>
              x
            </button>
            <h4>Generate QR Code for Attendance</h4>
            <form className="qr-form">
              <label>
                Date:
                <input type="date" name="date" value={qrDetails.date} onChange={handleQrInputChange} />
              </label>
              <label>
                Start Time:
                <input type="time" name="startTime" value={qrDetails.startTime} onChange={handleQrInputChange} />
              </label>
              <label>
                Duration (hours):
                <input type="number" name="duration" value={qrDetails.duration} onChange={handleQrInputChange} />
              </label>
              <label>
                Expiration Time (minutes, default is 10):
                <input
                  type="number"
                  name="expirationTime"
                  value={qrDetails.expirationTime || 10}
                  onChange={handleQrInputChange}
                />
              </label>
              <button className="details" onClick={handleGenerateQr}>
                Generate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display Generated QR Code */}
      {generatedQrData && (
        <div className="modal">
          <div className="modal-content qr-modal-content">
            <button className="close-modal" onClick={() => setGeneratedQrData(null)}>
              x
            </button>
            <h4>QR Code for Session</h4>
            <div>
              <p>Expires At: {new Date(generatedQrData.expirationTimestamp).toLocaleTimeString()}</p>
              <QRCodeSVG
                value={JSON.stringify(generatedQrData)}
                size={qrZoom}
                className={`qr-code ${qrFullScreen ? 'fullscreen-qr' : ''}`}
              />
              <div className="qr-actions">
                <button
                  className="zoom-in"
                  onClick={() => setQrZoom(qrZoom + 50)}
                  title="Zoom In"
                >
                  <AiOutlineZoomIn size={24} />
                </button>
                <button
                  className="zoom-out"
                  onClick={() => setQrZoom(Math.max(qrZoom - 50, 256))}
                  title="Zoom Out"
                >
                  <AiOutlineZoomOut size={24} />
                </button>
                <button
                  className="fullscreen"
                  onClick={() => setQrFullScreen(!qrFullScreen)}
                  title={qrFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                >
                  {qrFullScreen ? <AiOutlineFullscreenExit size={24} /> : <AiOutlineFullscreen size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Student Details */}
      {showDetails && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              x
            </button>
            <h4>Attendance Details for Student</h4>
            <p>
              {classDetails.students.find((student) => student.studentId === showDetails)?.attendance.map(
                (record, index) => (
                  <div key={index}>
                    <p>
                      Date: {record.date} | Hours Present: {record.hoursPresent} | Hours Absent: {record.hoursAbsent}
                    </p>
                  </div>
                )
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerClassDetails;
