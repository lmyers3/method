const express = require('express')
const app = express()
const payInstrRoutes = require('./routes/payment-instruction')

global.__basedir = __dirname;

app.use("/", payInstrRoutes)

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})
