const express = require("express");
var morgan = require('morgan')
const cors = require("cors");
const app = express();

app.use(express.json());
morgan.token('information', function (req, res) {
    if (req.method === "POST") {
        return JSON.stringify({
            name: req.body.name, number: req.body.number
        })
    }
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :information"));
app.use(cors());

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/info', (request, response) => {
    const info = `Phonebook has info for ${persons.length || 0} people`
    const time = new Date();

    response.send(`<div>${info}</div><br/><div>${time}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(p => p.id === id);

    if (!person) return response.status(404).end();

    response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(p => p.id !== id)
    
    response.status(204).end();
})

const generateId = () => Math.ceil(Math.random() * 10000000)

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "must provide name and number"
        })
    }

    const entryExists = persons.find(p => p.name === body.name)
    if (entryExists) {
        return response.status(400).json({
            error: "must be unqiue"
        })
    }

    const newPerson = {
        id: String(generateId()),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson);
    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})