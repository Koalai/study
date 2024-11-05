import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCountry } from './hooks/useCountry'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}



const Country = ({ country, loading, error }) => {
  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!country || !country.found) {
    return <div>Country not found...</div>
  }


  return (
    <div>
      <h3>{country.data.name.common}</h3> 
      <div>Capital: {country.data.capital}</div>
      <div>Population: {country.data.population}</div> 
      <img src={country.data.flags.svg} height="100" alt={`Flag of ${country.data.name.common}`} />
    </div>
  )
}
const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const { country, loading, error } = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} loading={loading} error={error} />
    </div>
  )
}

export default App