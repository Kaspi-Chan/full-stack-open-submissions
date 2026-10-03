import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios';

const Filter = ({filter, handleChange}) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleChange}/>
    </div>
  )
}

const PersonsForm = (props) => {
  const {handleSubmit, newName, newNumber, handleNameChange, handleNumberChange} = props;
  return (
    <form onSubmit={handleSubmit}>
      <PersonInput text="name" value={newName} handleChange={handleNameChange} />
      <PersonInput text="number" value={newNumber} handleChange={handleNumberChange} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const PersonInput = ({text, value, handleChange}) => (
  <div>
    {text}: <input value={value} onChange={handleChange}/>
  </div>
)

const Person = ({name, number}) => <div>{name} {number}</div>
const Persons = ({collection}) => collection.map(p => <Person key={p.name} name={p.name} number={p.number}/>)

const App = () => {
  const [persons, setPersons] = useState([])

  // Fetch persons from 3001/persons
  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(res => setPersons(res.data));
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const entryExists = persons.some(p => p.name === newName);
    if (entryExists) return alert(`${newName} is already added to phonebook`)
      
    const newPersons = persons.concat({name: newName, number: newNumber})
    setPersons(newPersons)
  }

  const filterPersons = (p) => p.name.toLowerCase().includes(filter.toLowerCase());

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleChange={(e) => setFilter(e.target.value)} />
      <h3>add new</h3>
      <PersonsForm 
        handleSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons collection={persons.filter(filterPersons)} />
    </div>
  )
}

export default App