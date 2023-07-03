const path = require('path')
const fs = require('fs')
const XmlStream = require('xml-stream')
const stagePayment = require('./paymentstaging')
const findMerchantId = require('./merchant')

const filePath = path.join(__dirname,'..', '/uploads/')

const payments = {}
const merchants = {}

let promiseQueue = Promise.resolve();

const process = (req, res, next) => {
    console.log(`Reading file from ${req.file.filename}`)

    const stream = fs.createReadStream(path.join(filePath, req.file.filename))
    stream.setEncoding('UTF8')

    const xml = new XmlStream(stream)

    xml.on('endElement: row', async(chunk) => {
      promiseQueue = promiseQueue
        .then(() => stagePayment(chunk, payments))
        .then(() => findMerchantId(getPlaidId(chunk), merchants))
    })

    xml.on('end', () => {
      promiseQueue
        .then( () => console.log("all operations completed"))
        // .then( () => console.log(JSON.stringify(payments)))
        .then( () => console.log(JSON.stringify(merchants)))
    })

    xml.on('error', () => {
      console.log("ERROR")
    })

    next()
}

let getPlaidId = (chunk) => chunk['Payee']['PlaidId']


module.exports = {process};