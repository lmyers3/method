const path = require('path')
const fs = require('fs')
const XmlStream = require('xml-stream')
const Dinero = require('dinero.js')

const filePath = path.join(__dirname,'..', '/uploads/')

const payments = {}

const initialize = (req, res, next) => {
    console.log(`Reading file from ${req.file.filename}`)

    const stream = fs.createReadStream(path.join(filePath, req.file.filename))
    stream.setEncoding('UTF8')

    const xml = new XmlStream(stream)

    let i = 0;
    xml.on('endElement: row', (chunk) => {
      getDestAccount(chunk)
    })

    xml.on('end', () => {
      //console.log(JSON.stringify(payments))
    })

    xml.on('error', () => {
      console.log("ERROR")
    })

    next()
}

const getDestAccount = (chunk) => {
  let branchId = getBranch(chunk)
  let employeeId = getEmployee(chunk)
  let accountNumber = getAccount(chunk)
  let amount = getAmount(chunk)
  let plaidId = getPlaidId(chunk)

  let employee = payments[employeeId]

  if (employee) {
    let account = employee['accounts'].find(ele => ele.accountNumber === accountNumber)
    if (account) {
      let origAmount = getDinero(account.amount)
      account.amount = origAmount.add(amount).getAmount()
    }
    else {
      let account = {
        "amount": amount.getAmount(),
        "accountNumber": accountNumber,
        "plaidId": plaidId
      }
      employee["accounts"].push(account)
    }
  }
  else {
    let account = {
      "amount": amount.getAmount(),
      "accountNumber": accountNumber,
      "plaidId": plaidId
    }
    //add new employee
    payments[employeeId] = {
      "accounts": [account],
      "branchId": branchId
    }
  }
  
}

let getBranch = (chunk) => chunk['Employee']['DunkinBranch']
let getEmployee = (chunk) => chunk['Employee']['DunkinId']
let getAccount = (chunk) => chunk['Payee']['LoanAccountNumber']
let getAmount = (chunk) => {
  let amountString = chunk['Amount'].replace('$', '').replace('.', '')
  let amount = parseInt(amountString)
  return getDinero(amount)
}
let getPlaidId = (chunk) => chunk['Payee']['PlaidId']
let getDinero = (amount) => Dinero({ amount: amount })

module.exports = {initialize};