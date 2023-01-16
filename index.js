const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": 4,
        "name": "sample", 
        "number": "39-23-6423122"
      }
]


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }


app.use(express.json())
app.use(cors())
app.use(express.static('build'))
//app.use(requestLogger)
/*app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

morgan.token('content', req => { 
    return JSON.stringify(req.body) })

*/

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})


app.get('/info', (req, res) => {
    const time = new Date()
    const entries = persons.length
    res.send(`
    <p>Phonebook has info for ${entries} people</p>
    <p>${time}
    `)
  })

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name && !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  const state = persons.find(n => n.name === body.name)
  if(state !== undefined){
    return response.status(500).json({
        error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

