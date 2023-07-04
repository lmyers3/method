const createEmployee = require('./employee')
const {linkCorpAccount, linkLiability} = require('./account')
const {writeDataToCSV} = require('../util/StagingFile')
const maskAccountNumber = require('../util/AccountMask')
const path = require('path')

require('dotenv').config()

const corpId = process.env.CORP_ENTITY_ID

var filename
var date

const processPayments = async (payments, merchants, sourceAccounts, file) => {
    filename = file["filename"]
    date = file["date"]

    // Transform the payments object to an array of promises
    const promises = Object.keys(payments).map(async empId => {
      const employee = payments[empId];
      const indvEntityId = await createEmployee(employee);
      employee["entityId"] = indvEntityId;
      console.log("Processing entity for : " + indvEntityId);
      const payment = await processPaymentsForEmployee(employee, merchants, sourceAccounts);
    });
  
    // Wait for all promises to resolve
    await Promise.all(promises);
  
    return path.join(date, filename);
  };
  

const processPaymentsForEmployee = async (employee, merchants, sourceAccounts) => {
    let payment
    let accounts = employee["accounts"]
    console.log(`PROCESSING ${accounts.length}`)
    let promises = accounts.map( async ele => {
        let plaidId = ele["plaidId"]
        if (merchants[plaidId] === "INVALID") {
            console.log("INVALID PAYMENT")
            payment = createPaymentObject(employee, ele)
            payment["plaidId"] = "INVALID"
            await writeDataToCSV(date, filename, payment)
            return //dont process payment
        } else {

            let srcAcctId = await processSourceAccount(corpId, ele, sourceAccounts)
            let liabilityId = await processLiability(employee["entityId"], ele, merchants)

            ele["source"] = srcAcctId
            ele["destination"] = liabilityId

            payment = createPaymentObject(employee, ele)
            let wrote = await writeDataToCSV(date, filename, payment)
            console.log("wrote data!!!"+ wrote)
        }
    })

    await Promise.all(promises)

    return payment
} 

const processSourceAccount = async (entityId, account, sourceAccounts) => {
    let srcAcctNum = account['srcAccountNumber']
    let srcAcctId = sourceAccounts[srcAcctNum]

    if (sourceAccounts[srcAcctNum]) return srcAcctId

    srcAcctId = await linkCorpAccount(entityId, account, sourceAccounts)
    console.log(`Created source acct with : ${srcAcctId}`)
    return srcAcctId
}   

const processLiability = async (entityId, account, merchants) => {
    let liabilityId = await linkLiability(entityId, account, merchants)
    return liabilityId
}

const processPayment = async () => {

}

const createPaymentObject = (employee, account) => {
    let status = account["source"] && account["destination"] ? "success" : "failure"
    return {
        "employeeId": employee["employeeId"],
        "dunkinBranchId": employee["branchId"],
        "dunkinStoreId": account["storeId"],
        "firstName": employee["firstName"],
        "lastName": employee["lastName"],
        "routing": account["srcRouting"],
        "srcAccountNumber": maskAccountNumber(account["srcAccountNumber"]),
        "srcAccountId": account["source"],
        "destAccountNumber": maskAccountNumber(account["accountNumber"]),
        "destAccountId": account["destination"],
        "plaidId": account["plaidId"],
        "stagingStatus": status,
        "amount": account["amount"]
    }
}


module.exports = processPayments