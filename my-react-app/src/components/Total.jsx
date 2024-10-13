import React from 'react'

function Total({course}) {
  return (
    <>
      <p>
        Number of exercises{' '}
        {course['parts'].reduce((acc, part) => {
         return acc + part['exercises']
        }, 0)}
      </p>
    </>
  );
}

export default Total