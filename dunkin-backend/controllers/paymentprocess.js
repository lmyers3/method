const createEmployee = require('./employee')
const {linkCorpAccount, linkLiability} = require('./account')
const {writeJsonToFile, generateRandomString} = require('../util/StagingFile')
const maskAccountNumber = require('../util/AccountMask')

require('dotenv').config()

const corpId = process.env.CORP_ENTITY_ID

const filename = generateRandomString()+".csv"

const processPayments = async(payments, merchants, sourceAccounts) => {

    for (const empId of Object.keys(payments)) {
        //create individual entity
        const employee = payments[empId]
        let indvEntityId = await createEmployee(employee) 
        employee["entityId"] = indvEntityId
        console.log("Processing entity for : "+indvEntityId)
        let payment = await processPaymentsForEmployee(employee, merchants, sourceAccounts)
    }

}

const processPaymentsForEmployee = (employee, merchants, sourceAccounts) => {
    let payment
    return new Promise( async resolve => {
        let accounts = employee["accounts"]
        console.log(`PROCESSING ${accounts.length}`)
        accounts.forEach( async(ele) => {
            let plaidId = ele["plaidId"]
            if (merchants[plaidId] === "INVALID") {
                console.log("INVALID PAYMENT")
                return //dont process payment
            } else {

                let srcAcctId = await processSourceAccount(corpId, ele, sourceAccounts)
                let liabilityId = await processLiability(employee["entityId"], ele, merchants)

                ele["source"] = srcAcctId
                ele["destination"] = liabilityId

                payment = createPaymentObject(employee, ele)
                await writeJsonToFile(filename, payment)
                console.log(payment)
            }
        })
        resolve(payment)
    })
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
        "amount": account["amount"]
    }
}


module.exports = processPayments