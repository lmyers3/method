const path = require('path')
const fs = require('fs')
const XmlStream = require('xml-stream')
const stagePayment = require('./paymentstaging')
const findMerchantId = require('./merchant')
const fetchCorpAccounts = require('./account').fetchCorpAccounts
const processPayments = require('./paymentprocess')

require('dotenv').config()

const filePath = path.join(__dirname,'..', '/uploads/')

const payments = {}
const merchants = {}
const sourceAccounts = {}

const corpId = process.env.CORP_ENTITY_ID

let promiseQueue = Promise.resolve();

const execute = (req, res, next) => {
    console.log(`Reading file from ${req.file.filename}`)

    const stream = fs.createReadStream(path.join(filePath, req.file.filename))
    stream.setEncoding('UTF8')

    const xml = new XmlStream(stream)

    promiseQueue = promiseQueue
    .then(() => fetchCorpAccounts(corpId, sourceAccounts))
    .then(() => console.log(sourceAccounts))

    xml.on('endElement: row', async(chunk) => {
      promiseQueue = promiseQueue
        .then(() => stagePayment(chunk, payments))
        .then(() => findMerchantId(getPlaidId(chunk), merchants))
    })

    xml.on('end', () => {
      promiseQueue
        .then( () => console.log("all operations completed"))
        .then( () => processPayments(payments, merchants, sourceAccounts))
    })

    xml.on('error', () => {
      console.log("ERROR")
    })

    next()
}

let getPlaidId = (chunk) => chunk['Payee']['PlaidId']


module.exports = {execute};