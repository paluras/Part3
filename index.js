const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('build'))
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
    response.json(numbers)
  })

  app.get("/info",(request, response)=> {
    response.send(`<p>Phonebook has info for ${numbers.length} people <p>
                   <p> ${date}</p>`)
  })
  
  app.get("/api/numbers/:id", (request, response)=> {
    const id = Number(request.params.id)
    const person = numbers.find(person => person.id === id)
    if(person){response.json(person)
    }else{
        response.status(404).end()
    }
  })

  app.delete("/api/numbers/:id", (request,response)=>{
    const id = Number(request.params.id)
    numbers = numbers.filter(p => p.id !== id)

    response.status(204).end()
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

  

  app.use(express.json())
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

    const number = {
        id: generateId(),
        name:body.name,
        number : body.number
        
    }

    numbers = numbers.concat(number)
    response.json(number)
  })

  morgan.token('tiny', (req, res)=>
   { return req.headers['content-type'] })


const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })