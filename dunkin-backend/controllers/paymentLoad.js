const Dinero = require('dinero.js')

const stagePayment = (chunk, payments) => {
  return new Promise( resolve => {
    let account = initData(chunk, payments)
    resolve(account)
  })
}

const initData = (chunk, payments) => {
    let branchId = getBranch(chunk)
    let employeeId = getEmployee(chunk)
    let accountNumber = getAccount(chunk)
    let srcAccount = getSourceAccount(chunk)
    let amount = getAmount(chunk)
  
    let employee = payments[employeeId]
    let account = {}
  
    if (employee) {
      account = employee['accounts'].find(ele => ele.accountNumber === accountNumber && ele.srcAccountNumber === srcAccount)
      if (account) {
        //aggregate payment
        let origAmount = getDinero(account.amount)
        account.amount = origAmount.add(amount).getAmount()
      }
      else {
        //add account
        account = createAccount(chunk)
        employee["accounts"].push(account)
      }
    }
    else {
      account = createAccount(chunk)
      //add new employee
      payments[employeeId] = {
        "accounts": [account],
        "employeeId": employeeId,
        "branchId": branchId,
        "firstName": chunk["Employee"]["FirstName"],
        "lastName": chunk["Employee"]["LastName"]
      }
    }
    return account
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

let createAccount = (chunk) => {
    let accountNumber = getAccount(chunk)
    let srcAccount = getSourceAccount(chunk)
    let srcRouting = chunk['Payor']['ABARouting']
    let amount = getAmount(chunk)
    let plaidId = getPlaidId(chunk)

    let account = {
        "amount": amount.getAmount(),
        "plaidId": plaidId,
        "accountNumber": accountNumber,
        "srcAccountNumber": srcAccount,
        "srcRouting": srcRouting,
        "storeId": chunk["Payor"]["DunkinId"]
    }
    return account  
}

module.exports = stagePayment