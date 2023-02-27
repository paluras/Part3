require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require("./models/persons")


app.use(express.static('build'))
app.use(express.json())
app.use(morgan("tiny"))

const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
  
}

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
    Person.find({}).then(numbers => {
    response.send(`<p>Phonebook has info for ${numbers.length} people <p>
                   <p> ${date}</p>`)
                })
  })
  
  
  app.get("/api/numbers/:id", (request, response , next)=> {
    Person.findById(request.params.id)
    .then(ppl => {
        if(ppl){response.json(ppl)
        }else {
            response.status(404).end()
        }
      })
      .catch(error => next(error))
       
      })
 
   

  app.delete("/api/numbers/:id", (request,response,next)=>{
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  
//Update Name 
  app.put('/api/numbers/:id', (request, response, next) => {
    const body = request.body
  
    const number =  {
        
        name:body.name,
        number : body.number
        
    }
  
    Person.findByIdAndUpdate(request.params.id, number, { new: true })
      .then(updatedPers => {
        response.json(updatedPers)
      })
      .catch(error => next(error))
  })
  
  
  app.post("/api/numbers", (request,response)=>{
   
    const body = request.body
    console.log(body);
    const existingPerson = numbers.find(person => person.name === body.name)
     const number = new Person( {
        
        name:body.name,
        number : body.number
        
    })

    if(!body.name && !body.number){
        return response.status(400).json({
            error:"You must insert something AAAAAAAA"
        })
    }else if(existingPerson){
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

   

    number.save()
    .then(savedPers => {
        response.json(savedPers)
    })
    
  })
  
app.use(errorHandler)

  morgan.token('tiny', (req, res)=>
   { return req.headers['content-type'] })


const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })