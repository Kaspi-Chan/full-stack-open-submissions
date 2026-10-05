import { useState } from 'react'
import axios from "axios"
import { useEffect } from 'react';

const BASE_URL = "https://studies.cs.helsinki.fi/restcountries/api/all"
const API_KEY = import.meta.env.VITE_SOME_KEY;
const WEATHER_URL_BASE = "https://api.openweathermap.org/data/2.5/weather?";
const ICON_URL_BASE = "https://openweathermap.org/img/wn/";

const CountryResult = ({ countries, selected, setSelected }) => {
  if (!countries) return null;

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  const isVisible = (c) => {
    if (!selected) return false;

    return selected.name.common === c.name.common;
  }

  // Default case -> query matches 1 country
  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return (
    <>
      {countries.map(c => (
        <div key={c.name.common}>
          {c.name.common}
          <button onClick={() => setSelected(isVisible(c) ? null : c)}>
            {isVisible(c) ? 'Hide' : 'Show'}
          </button>
        </div>
      ))}
      {selected && <Country country={selected} />}
    </>
  )
}

const Country = ({ country }) => {
  const hasCapital = country.capital;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (hasCapital) {
      axios
        .get(`${WEATHER_URL_BASE}q=${country.capital}&appid=${API_KEY}&units=metric`)
        .then((result) => setWeather({
            temp: result.data.main.temp,
            wind: result.data.wind.speed,
            icon: {
              src: `${result.data.weather[0].icon}@2x.png`, 
              alt: `Icon showcasing ${result.data.weather[0].description} weather`}
          }))
    }
  }, [country.capital]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {hasCapital ? country.capital[0] : "No capital"}</div>
      <div>Area {country.area ?? "No area"}</div>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages || []).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={country.flags.alt} />

      {weather && (
        <div>
          <h2>Weather in {country.capital}</h2>
          <div>Temperature {weather.temp}</div>
          <img src={`${ICON_URL_BASE}/${weather.icon.src}`} alt={weather.icon.alt} />
          <div>Wind {weather.wind} m/s</div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [value, setValue] = useState("")
  const [countries, setCountries] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios
      .get(BASE_URL)
      .then(res => setCountries(res.data))
  }, [])

  const handleSearch = (e) => {
    setValue(e.target.value);
    setSelected(null);
  }

  const filterCountries = (c) => {
    return c.name.common.toLowerCase().includes(value.toLowerCase());
  }

  return (
    <div>
      <div>
        Find countries <input value={value} onChange={handleSearch} />
      </div>

      <CountryResult
        countries={countries ? countries.filter(filterCountries) : null}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  )
}

export default App
