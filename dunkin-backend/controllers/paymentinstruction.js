const path = require('path')
const fs = require('fs')
const XmlStream = require('xml-stream')
const stagePayment = require('./paymentstaging')
const findMerchantId = require('./merchant')
const fetchCorpAccounts = require('./account').fetchCorpAccounts
const processPayments = require('./paymentprocess')
const {generateRandomString, getDateString} = require('../util/StagingFile')

require('dotenv').config()

const filePath = path.join(__dirname,'..', '/uploads/')

const corpId = process.env.CORP_ENTITY_ID

let promiseQueue = Promise.resolve();

const execute = (req, res, next) => {
    const file = makeFileName()

    const payments = {}
    const merchants = {}
    const sourceAccounts = {}

    console.log(`Reading file from ${req.file.filename}`)

    const stream = fs.createReadStream(path.join(filePath, req.file.filename))
    stream.setEncoding('UTF8')

    const xml = new XmlStream(stream)

    promiseQueue = promiseQueue
      .then(() => fetchCorpAccounts(corpId, sourceAccounts))
      .then(() => console.log(sourceAccounts))

    xml.on('endElement: row', async(chunk) => {
      promiseQueue = promiseQueue
        .then(() => req["outbound"]= file)
        .then(() => next())
        .then(() => stagePayment(chunk, payments))
        .then(() => findMerchantId(getPlaidId(chunk), merchants))
    })

    xml.on('end', () => {
      promiseQueue = promiseQueue
        .then( () => processPayments(payments, merchants, sourceAccounts, file))
        .then( (filename) => {
          console.log(`${filename} was successfully generated`)
          next()
        })
    })

    xml.on('error', () => {
      console.log("ERROR")
    })

}

let getPlaidId = (chunk) => chunk['Payee']['PlaidId']

let makeFileName = () => {
  return {
    "filename": generateRandomString()+".csv",
    "date": getDateString()
  }
}


module.exports = {execute};