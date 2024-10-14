import React from 'react';
import Content from './Content';
import Header from './Header';

function Courses({ courses }) {
  return (
    <div>
      {courses.map((course) => {
        return (
          <div key={course.id}>
            <Header course={course} />
            <Content course={course}/>
            <h2>Total of {' '} {course['parts'].reduce((acc, p) => acc + p.exercises, 0)} exercise</h2>
          </div>
        );
      })}
    </div>
  );
}

export default Courses;
