import React from 'react';

function Filter({ filterName, setFilterName }) {
  return (
    <div>
      Filter shown with{' '}
      <input
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
      />
    </div>
  );
}

export default Filter;
