import React from 'react'

function Person({ person}) {
  return (
   <>
    {person.map(p => (
     <div key={p.id}>
      {p.name} {p.number}
     </div>
    ))}
   </>
  )
}

export default Person