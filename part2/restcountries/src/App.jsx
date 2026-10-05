import { useState } from 'react'
import axios from "axios"

const BASE_URL = "https://studies.cs.helsinki.fi/restcountries/api/all"

const CountryResult = ({countries}) => {
  if (!countries) return null;

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return (
    countries.map(c => (
      <div key={c.name.common}>{c.name.common}</div>
    ))
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


  const handleSearch = (e) => {
    const newValue = e.target.value
    setValue(newValue);

    if (countries) return;

    // move to useEffect
    axios
      .get(BASE_URL)
      .then(res => setCountries(res.data))
  }

  const filterCountries = (c) => {
    return c.name.common.toLowerCase().includes(value.toLowerCase());
  }

  return (
    <div>
      <div>
        Find countries <input value={value} onChange={handleSearch} />
      </div>

      <CountryResult countries={countries ? countries.filter(filterCountries) : null} />
    </div>
  )
}

export default App
