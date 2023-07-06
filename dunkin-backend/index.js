const express = require('express')
const app = express()
var cors = require('cors');
const payInstrRoutes = require('./routes/payment-instruction')
const filesRouter = require('./routes/files')
const stagingRouter = require('./routes/staging')

global.__basedir = __dirname;

app.use(cors())

app.use("/", [payInstrRoutes, filesRouter, stagingRouter])


app.listen(5000, () => {
    console.log('server is listening on port 5000')
})
