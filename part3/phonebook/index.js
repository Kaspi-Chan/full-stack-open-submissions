require('dotenv').config()
const express = require("express");
var morgan = require('morgan')
const app = express();
const Person = require('./models/people')

// Serve frontend build files
app.use(express.static('dist'))

app.use(express.json());
morgan.token('information', function (req, res) {
    if (req.method === "POST") {
        return JSON.stringify({
            name: req.body.name, number: req.body.number
        })
    }
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :information"));

app.get('/api/people', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    })
})

app.get('/info', (request, response) => {
    const info = `Phonebook has info for ${persons.length || 0} people`
    const time = new Date();

    response.send(`<div>${info}</div><br/><div>${time}</div>`)
})

app.get('/api/people/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(p => p.id !== id)
    
    response.status(204).end();
})

app.post('/api/people', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "must provide name and number"
        })
    }

    // const entryExists = persons.find(p => p.name === body.name)
    // if (entryExists) {
    //     return response.status(400).json({
    //         error: "must be unqiue"
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})