require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require("./models/persons")
app.use(express.static('build'))
app.use(express.json())
app.use(morgan("tiny"))
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

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
        .then(() => {
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
  
  
app.post("/api/numbers", (request,response,next)=>{
   
    const body = request.body
    console.log(body);
    const number = new Person( {
        
        name:body.name,
        number : body.number
        
    })


    number.save()
        .then(savedPers => {
            response.json(savedPers)
        })
        .catch(error => next(error))    
})
  
app.use(errorHandler)

morgan.token('tiny', (req, res)=>
{ return req.headers['content-type'] })


const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})