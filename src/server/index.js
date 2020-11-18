const express = require('express')
const path = require('path')
const app = express()
require('dotenv').config({ path: path.join(process.cwd(), 'src', 'config', '.env') })


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT)