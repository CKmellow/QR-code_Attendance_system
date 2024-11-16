import React from 'react';
import './StuDash.css';  


const classes = [
    { id: 1, name: 'Math 101', hourspresent: 25, hoursabsent: 2 },
    { id: 2, name: 'Physics 101', hourspresent: 30, hoursabsent: 4 },
    { id: 3, name: 'Chemistry 101', hourspresent: 22, hoursabsent: 1 },
    { id: 4, name: 'History 101', hourspresent: 28, hoursabsent: 3 },
    { id: 5, name: 'Biology 101', hourspresent: 20, hoursabsent: 5 },

  
];  // More example class data

const StudentDash = () => {
  return (
    <div className="dashboard-container">
      <div className="dash">
      <h2>Classes</h2>
      </div>
      
      <div className="class-grid">
        {classes.map((classItem) => {
        // Calculate absent percentage dynamically
         const totalHours = classItem.hourspresent + classItem.hoursabsent;
        const absentPercentage = ((classItem.hoursabsent / totalHours) * 100).toFixed(2);

    return (
      <div key={classItem.id} className="class-tile">
        <h3>{classItem.name}</h3>
        <p>Hours Present: {classItem.hourspresent}</p>
        <p>Hours Absent: {classItem.hoursabsent}</p>
        <p id="percentage">Percentage Absent: {absentPercentage}%</p>
        <button className="view-class-button">View Class</button> {/* Handle navigation */}
      </div>
    );
  })}
</div>

    </div>
  );
};

export default StudentDash;
