const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const app = express()
require('dotenv').config({ path: path.join(process.cwd(), 'src', 'config', '.env') })

mongoose.connect(process.env.MongoDB, { useUnifiedTopology: true, useNewUrlParser: true })
  // Handle initial connection errors
  .catch(console.error)

// Handle errors after initial connection was established
mongoose.connection.on('error', console.error)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT)