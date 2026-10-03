import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
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
      filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)}/>
      <h2>add new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.filter(filterPersons).map(p => <div key={p.name}>{p.name} {p.number}</div>)}
    </div>
  )
}

export default App