import { useEffect } from 'react';
import { useState } from 'react'
import services from "./services/persons"

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

const Person = ({id, name, number, handleDelete}) => {
  return (
    <div>
      {name} {number} 
      <button onClick={() => handleDelete(id, name)}>delete</button>
    </div>
  )
}
const Persons = ({collection, handleDelete}) => {
  return (
    collection.map(p => (
      <Person 
        key={p.name} 
        id={p.id}
        name={p.name} 
        number={p.number}
        handleDelete={handleDelete} />)
    )
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  // Fetch persons from 3001/persons
  useEffect(() => {
    services
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newName === "" || newNumber === "") return;

    const newPersonObject = {name: newName, number: newNumber};

    const entryExists = persons.some(p => p.name === newName);
    if (entryExists) {
      if(window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )) {
        const id = persons.find(p => p.name === newName).id;
        services
          .changeNumber(id, newPersonObject)
          .then(changedObj => {
            setPersons(persons.map(p => p.id === id ? changedObj : p))
          })
      }

      return;
    }

    services
      .addNew(newPersonObject)
      .then(newObject => setPersons(persons.concat(newObject)))
  }

  const filterPersons = (p) => p.name.toLowerCase().includes(filter.toLowerCase());

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      services
        .deleteEntry(id)
        .then(res => setPersons(persons.filter(p => p.id !== id)));
    }
  }

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
      <Persons 
        collection={persons.filter(filterPersons)}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App