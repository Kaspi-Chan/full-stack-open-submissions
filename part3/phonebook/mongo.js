const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://admin:${password}@cluster0.mxtdqpe.mongodb.net/phoneBook?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personsSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personsSchema);

if (!name && !number) {
    Person.find({}).then(persons => {
        console.log("phonebook:")
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
    return;
}

const person = new Person({ name, number })

person.save().then(p => {
  console.log(`added ${p.name} number ${p.number} to phonebook`)
  mongoose.connection.close()
})