const express = require('express')
var cors = require('cors') 
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://iiitvicd:iiitv123@cluster0.lgokxw0.mongodb.net/?retryWrites=true&w=majority' , {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});


const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/auth', require('./Routes/Routes'))


app.listen(port, () => {
  console.log(`Fest Website backend listening at http://localhost:${port}`)
})