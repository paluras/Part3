const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.set('strictQuery',false)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


    function validatePhoneNumber(phoneNumber) {
     
      const pattern = /^\d{2,3}-\d{8,9}$/;
    
 
      if (pattern.test(phoneNumber)) {
        return true;
      } else {
        return false;
      }
    }

const personsSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
    },
  number: {
    type: String,
    minLength: 8,
    validate: validatePhoneNumber


  },
})






personsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personsSchema)