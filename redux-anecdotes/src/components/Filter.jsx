import React from 'react';
import { useDispatch } from 'react-redux';
import { setFilter } from '../reducers/filterReducer';

function Filter() {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const filterValue = event.target.value;
    dispatch(setFilter(filterValue));
  };

  return (
    <div>
      <p>Filter</p>
      <input onChange={handleChange} />
    </div>
  );
}

export default Filter;
