const path = require('path')
const fs = require('fs')
const XmlStream = require('xml-stream')
const Dinero = require('dinero.js')
const MerchantCache = require('./cache')

const filePath = path.join(__dirname,'..', '/uploads/')

const payments = {}

const process = (req, res, next) => {
    console.log(`Reading file from ${req.file.filename}`)

    const stream = fs.createReadStream(path.join(filePath, req.file.filename))
    stream.setEncoding('UTF8')

    const xml = new XmlStream(stream)

    xml.on('endElement: row', (chunk) => {
      initData(chunk)
    })

    xml.on('end', () => {
      //console.log(JSON.stringify(payments))
    })

    xml.on('error', () => {
      console.log("ERROR")
    })

    next()
}

const initData = (chunk) => {
  let branchId = getBranch(chunk)
  let employeeId = getEmployee(chunk)
  let accountNumber = getAccount(chunk)
  let amount = getAmount(chunk)
  let plaidId = getPlaidId(chunk)

  let employee = payments[employeeId]

  if (employee) {
    let account = employee['accounts'].find(ele => ele.accountNumber === accountNumber)
    if (account) {
      //aggregate payment
      let origAmount = getDinero(account.amount)
      account.amount = origAmount.add(amount).getAmount()
    }
    else {
      //add account
      let account = createAccount(amount, accountNumber, plaidId, getSourceAccount(chunk))
      employee["accounts"].push(account)
    }
  }
  else {
    let account = createAccount(amount, accountNumber, plaidId, getSourceAccount(chunk))
    //add new employee
    payments[employeeId] = {
      "accounts": [account],
      "branchId": branchId,
      "entityId": ""
    }
  }
  
}

let getBranch = (chunk) => chunk['Employee']['DunkinBranch']
let getEmployee = (chunk) => chunk['Employee']['DunkinId']
let getAccount = (chunk) => chunk['Payee']['LoanAccountNumber']
let getSourceAccount = (chunk) => chunk['Payor']['AccountNumber']
let getAmount = (chunk) => {
  let amountString = chunk['Amount'].replace('$', '').replace('.', '')
  let amount = parseInt(amountString)
  return getDinero(amount)
}
let getPlaidId = (chunk) => chunk['Payee']['PlaidId']
let getDinero = (amount) => Dinero({ amount: amount })

let createAccount = (amount, accountNumber, plaidId, source) => {
  let account = {
    "amount": amount.getAmount(),
    "accountNumber": accountNumber,
    "accountId": "",
    "plaidId": plaidId,
    "srcAccountNumber": source
  }
  MerchantCache(plaidId)
  return account
}


module.exports = {process};