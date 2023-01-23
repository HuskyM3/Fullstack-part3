const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  // eslint-disable-next-line no-undef
  process.exit(1)
}

// eslint-disable-next-line no-undef
const password = process.argv[2]

// eslint-disable-next-line no-undef
const name = process.argv[3]
// eslint-disable-next-line no-undef
const numb = process.argv[4]

const url = `mongodb+srv://HuskyM:${password}@cluster0.1avtsnv.mongodb.net/?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

// eslint-disable-next-line no-undef
if(process.argv.length === 3){

  mongoose.connect(url).then(() => {
    //console.log('connected')

    Person.find({}).then(result => {
      result.forEach(note => {
        console.log(note)
      })
      mongoose.connection.close()
    })
  }).catch((err) => console.log(err))
}else {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')

      const note = new Person({
        name: name,
        number: numb,
      })

      return note.save()
    })
    .then(() => {
      console.log(`added ${name} number ${numb} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))



}






