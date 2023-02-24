require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require("./models/persons")


app.use(express.static('build'))
app.use(express.json())
app.use(morgan("tiny"))



let numbers = [
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
    }
]
//Fuild for deployment commit 3.11 part
const date = new Date()

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/numbers', (request, response) => {
    Person.find({}).then(numbers => {
        response.json(numbers)
    })
  })

  app.get("/info",(request, response)=> {
    response.send(`<p>Phonebook has info for ${numbers.length} people <p>
                   <p> ${date}</p>`)
  })
  
  app.get("/api/numbers/:id", (request, response)=> {
    Note.findById(request.params.id)
    .then(ppl => {
        if(ppl){response.json(ppl)
        }else {
            response.status(404).end()
        }
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
  })

  app.delete("/api/numbers/:id", (request,response,next)=>{
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  const generateId = () => {
    const rndID = numbers.length > 0
      ? getRandomInt(5000)
      : 0
    return rndID
  }

  

  
  app.post("/api/numbers", (request,response)=>{
   
    const body = request.body

    if(!body.name && !body.number){
        return response.status(400).json({
            error:"You must insert something AAAAAAAA"
        })
    }

    const existingPerson = numbers.find(person => person.name === body.name)
    if(existingPerson){
      return response.status(400).json({
        error: "Name must be unique"
      })
    }
    const existinNumber = numbers.find(person => person.number === body.number)
    if(existinNumber){
      return response.status(400).json({
        error: "Numbers must be unique"
      })
    }

    const number = new Person( {
        id: generateId(),
        name:body.name,
        number : body.number
        
    })

    number.save()
    .then(savedPers => {
        response.json(savedPers)
    })
    
  })

  morgan.token('tiny', (req, res)=>
   { return req.headers['content-type'] })


const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })