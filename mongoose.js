const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
`mongodb+srv://paluraandrei1:${password}@cluster0.0pgwozk.mongodb.net/PhoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  name: name,
  number: number,
})


if(process.argv.length === 3){
    Note.find({}).then(result => {
        result.forEach(note => {
          console.log(note.name,note.number)
        })
        mongoose.connection.close()
      })
}else
    {note.save().then(result => {
  console.log(`Added ${note.name} number ${note.number} to phonebook`)
  mongoose.connection.close()
})
}