import React from 'react';

const ClassList = ({ classes }) => {
  return (
    <div className="class-list">
      <h2>Class List</h2>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id}>{classItem.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;