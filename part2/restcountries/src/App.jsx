import { useState } from 'react'
import axios from "axios"
import { useEffect } from 'react';

const BASE_URL = "https://studies.cs.helsinki.fi/restcountries/api/all"

const CountryResult = ({countries, selected, setSelected}) => {
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
    // const newValue = e.target.value
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
