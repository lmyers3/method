const express = require('express')
const app = express()
const payInstrRoutes = require('./routes/payment-instruction')
const filesRouter = require('./routes/files')

global.__basedir = __dirname;

app.use("/", [payInstrRoutes, filesRouter])


app.listen(5000, () => {
    console.log('server is listening on port 5000')
})
