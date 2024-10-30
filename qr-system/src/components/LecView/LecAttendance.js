import React, { useState, useEffect } from 'react';

// Mock data for classes
const classes = [
  { id: 1, name: 'Computer Science 101' },
  { id: 2, name: 'Software Engineering 201' },
  { id: 3, name: 'Data Structures 301' },
];

const LecAttendance = () => {
  // State to hold the selected class and its attendance data
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle fetching attendance data based on class ID
  const fetchAttendanceData = async (classId) => {
    setIsLoading(true);
    
    // Simulate an API call with a timeout for demo purposes
    setTimeout(() => {
      // Mock fetched attendance data for the selected class
      const fetchedData = [
        { id: 1, name: 'John Doe', status: 'Present' },
        { id: 2, name: 'Jane Smith', status: 'Absent' },
        { id: 3, name: 'Alice Johnson', status: 'Present' },
        { id: 4, name: 'Bob Brown', status: 'Present' },
      ];

      setAttendanceData(fetchedData);
      setIsLoading(false);
    }, 1000);
  };

  // Function to handle the "View" button click
  const handleViewAttendance = (classItem) => {
    setSelectedClass(classItem);
    fetchAttendanceData(classItem.id);
  };

  return (
    <div>
      <h1>Lecturer Dashboard</h1>
      
      {/* Display list of classes */}
      <h2>Classes</h2>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id}>
            {classItem.name} 
            <button onClick={() => handleViewAttendance(classItem)}>View</button>
          </li>
        ))}
      </ul>

      {/* Show selected class and attendance */}
      {selectedClass && (
        <div>
          <h2>Attendance for {selectedClass.name}</h2>
          
          {isLoading ? (
            <p>Loading attendance data...</p>
          ) : (
            <ul>
              {attendanceData.map((student) => (
                <li key={student.id}>
                  {student.name} - {student.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LecAttendance;
