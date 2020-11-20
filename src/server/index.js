const bodyParser = require('body-parser')
const passport = require('passport')
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

app.use(require('cors')()) // Cors for testing API
app.use(bodyParser.json())

// Define Routers
const { userRouter } = require('./routes/userRouter')
const { storeRouter } = require('./routes/storeRouter')

app.use('/user', userRouter)
app.use('/store', passport.authenticate('jwt', { session: false }), storeRouter)

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(process.env.PORT)