
require('dotenv').config()
const express = require('express')
const app = express()
//var morgan = require('morgan')
const cors = require('cors')
const Person = require('./person')
// eslint-disable-next-line no-unused-vars
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
  Person.find({}).then(result => {
    res.send(`
      <p>Phonebook has info for ${result.length} people</p>
      <p>${new Date()}
      `)
  })
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person( {
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
  //persons = persons.concat(person)

  //response.json(person)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(p => {
    res.json(p)
  })
})



app.delete('/api/persons/:id', (request, response) => {
  // eslint-disable-next-line no-unused-vars
  Person.findOneAndRemove(request.params.id).then(result => {
    response.status(204).end()
  // eslint-disable-next-line no-undef
  }).catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id).then(person => {
    if (person) {response.json(person)}
    else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
    //console.log(err)
  // response.status(400).send({err: 'malformed id'})
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators:true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})



const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.log(error.message)
  if (error.name === 'CastError'){
    return response.status(400).send({ error: 'malformed id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

