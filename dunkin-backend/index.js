const express = require('express')
const app = express()
var cors = require('cors');

const payInstrRoutes = require('./routes/payment-instruction')
const filesRouter = require('./routes/files')
const summaryRouter = require('./routes/summary')
const processPaymentsRouter = require('./routes/processPayments')
const reportRouter = require('./routes/report')

global.__basedir = __dirname;

app.use(cors())

app.use("/", [payInstrRoutes, filesRouter, summaryRouter, processPaymentsRouter, reportRouter])


app.listen(5000, () => {
    console.log('server is listening on port 5000')
})
