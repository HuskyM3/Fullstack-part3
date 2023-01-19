
require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./person')
const { response } = require('express')



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
app.use(requestLogger)
/*app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

morgan.token('content', req => { 
    return JSON.stringify(req.body) })

*/

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})


app.get('/info', (req, res) => {
    //const time = new Date()
    Person.find({}).then(result=> {
      res.send(`
      <p>Phonebook has info for ${result.length} people</p>
      <p>${new Date()}
      `)
  })
    /*
    res.send(`
    <p>Phonebook has info for ${entries} people</p>
    <p>${time}
    `)
    */
  })

  /*
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}
*/

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name && !body.number || body.name === undefined) { // check this 
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  /*
  might not work
  const state = persons.find(n => n.name === body.name)
  if(state !== undefined){
    return response.status(500).json({
        error: 'name must be unique'
    })
  }
  id: generateId(),
  */

  const person = new Person( {
    name: body.name,
    number: body.number,
    
  })

  person.save().then(savedPerson=> {
    response.json(savedPerson)
  })
  //persons = persons.concat(person)

  //response.json(person)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(p => {
        res.json(p)
    })
  //res.json(persons)
})



app.delete('/api/persons/:id', (request, response) => {
  Person.findOneAndRemove(request.params.id)
  .then(result=> {
    response.status(204).end()
  })
  .catch(error=> next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  
  Person.findById(request.params.id)
  .then(person => {
    if (person) {response.json(person)}
    else {
      response.status(404).end()
    }
  })
  .catch(err=> {
    next(err)
    //console.log(err)
   // response.status(400).send({err: 'malformed id'})
  })
  
  /*
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  */
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person)
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})



const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError'){
    return response.status(400).send({error: 'malformed id'})
  }
  next(error)
}
app.use(errorHandler)


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

