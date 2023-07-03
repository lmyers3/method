const createEmployee = require('./employee')
const linkCorpAccount = require('./account').linkCorpAccount


const processPayments = async(payments, merchants, sourceAccounts) => {

    for (const empId of Object.keys(payments)) {
        //create individual entity
        const employee = payments[empId]
        let indvEntityId = await createEmployee(employee) 
        console.log("Processing entity for : "+indvEntityId)
        //process their payments
        await processPaymentsForEmployee(indvEntityId, employee["accounts"], merchants, sourceAccounts)
    }

}

const processPaymentsForEmployee = async (entityId, accounts, merchants, sourceAccounts) => {
    console.log(`PROCESSING ${accounts.length}`)
    accounts.forEach( async(ele) => {
        let plaidId = ele["plaidId"]
        if (merchants[plaidId] === "INVALID") {
            console.log("INVALID PAYMENT")
            return //dont process payment
        } 

        await processSourceAccount(entityId, ele, sourceAccounts)

    })
} 

const processSourceAccount = async (entityId, account, sourceAccounts) => {
    console.log("inside processSouurceAccount")
    let srcAcctNum = account['srcAccountNumber']
    let srcAcctId = sourceAccounts[srcAcctNum]
    console.log(sourceAccounts[srcAcctNum])

    if (sourceAccounts[srcAcctNum]) return srcAcctId

    console.log("linking account")

    srcAcctId = await linkCorpAccount(entityId, account, sourceAccounts)
    console.log(`Created source acct with : ${srcAcctId}`)

}

const processLiability = () => {

}

const processPayment = () => {

}


module.exports = processPayments