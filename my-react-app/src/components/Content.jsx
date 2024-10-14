import React from 'react'
import Part from './Part';

function Content({course}) {
  return (
    <div>
      {course['parts'].map(p => (
        <div key={p.id}>
        <Part name={p.name} exercises={p.exercises} />
        </div>
      ))}
    </div>
  );
}

export default Content