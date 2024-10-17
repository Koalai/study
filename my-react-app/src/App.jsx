import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('');
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const api_key = import.meta.env.VITE_SOME_KEY;

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const fetchWeatherData = (country) => {
    const { latlng } = country.capitalInfo;
    if (latlng) {
      const [lat, lon] = latlng;
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
        )
        .then((response) => {
          setWeatherData(response.data);
        });
    }
  };

  useEffect(() => {
    if (expandedCountry) {
      fetchWeatherData(expandedCountry);
    }
  }, [expandedCountry]);


  useEffect(() => {
    const filteredCountries = countries.filter((c) =>
      c.name.common.toLowerCase().includes(country.toLowerCase())
    );

    if (filteredCountries.length === 1) {
      setExpandedCountry(filteredCountries[0]);
      fetchWeatherData(filteredCountries[0]);
    } else {
      setExpandedCountry(null);
      setWeatherData(null);
    }
  }, [country, countries]);


  const handleShowCountry = (id) => {
    const countryToShow = countries.find((c) => c.ccn3 === id);
    setExpandedCountry(
      countryToShow === expandedCountry ? null : countryToShow
    );
  };

  return (
    <>
      <p>
        Find countries:{' '}
        <input
          type='text'
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </p>
      <div>
        {country.length > 0 && (
          <>
            {filteredCountries.length === 0 ? (
              <p>No countries match</p>
            ) : filteredCountries.length >= 10 ? (
              <p>Too many countries match, specify another filter</p>
            ) : (
              <ul>
                {filteredCountries.map((c) => (
                  <li key={c.ccn3}>
                    {c.name.common}
                    <button onClick={() => handleShowCountry(c.ccn3)}>
                      Show
                    </button>
                    {expandedCountry === c && (
                      <div>
                        <h1>{c.name.common}</h1>
                        <p>Capital: {c.capital}</p>
                        <p>Area: {c.area}</p>
                        <ul>
                          Languages:
                          {Object.entries(c.languages).map(([code, name]) => (
                            <li key={code}>{name}</li>
                          ))}
                        </ul>
                        <img
                          src={c.flags.png}
                        />

                        {weatherData && (
                          <div>
                            <h2>Weather in {c.capital}</h2>
                            <p>Temperature: {weatherData.main.temp} °C</p>
                            <img
                              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                              alt='Weather icon'
                            />
                            <p>Wind: {weatherData.wind.speed} m/s</p>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default App;
