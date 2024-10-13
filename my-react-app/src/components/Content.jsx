import React from 'react'
import Part from './Part';

function Content({course}) {
  return (
    <div>
     {course['parts'].map((part, index) => (
      <div key={index}>
       <Part name={part.name} exercises={part.exercises} />
      </div>
     ))}
    </div>
  );
}

export default Content