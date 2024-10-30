// src/components/LecView/AttendanceView.js
import React from 'react';
import './AttendanceView.css'; // Optional: Add styling for AttendanceView

const AttendanceView = ({ className, attendanceData }) => {
  return (
    <div className="attendance-view">
      <h3>Attendance for {className}</h3>
      {attendanceData.length === 0 ? (
        <p>No attendance records available for this class.</p>
      ) : (
        <div className="attendance-list">
          {attendanceData.map(student => (
            <div key={student.admissionNumber} className="attendance-item">
              <p>{student.fullName} (Admission: {student.admissionNumber})</p>
              <p>Percentage Absent: {student.percentageAbsent}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceView;
