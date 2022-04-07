const express = require('express')
const app = express()
const dotenv = require("dotenv")
dotenv.config()
app.use(express.json());

// Start Server
app.use('/', express.static('./public/'))
app.listen(process.env.PORT || 5000, () => {
  console.log("Server Start", process.env.PORT || 5000)
})

const plcRoute = require('./routes/plc_routes')

// Router API
app.use('/plc/', plcRoute)

