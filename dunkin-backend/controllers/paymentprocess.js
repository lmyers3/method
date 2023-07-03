const createEmployee = require('./employee')
const {linkCorpAccount, linkLiability} = require('./account')

require('dotenv').config()

const corpId = process.env.CORP_ENTITY_ID

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

const processPaymentsForEmployee = (entityId, accounts, merchants, sourceAccounts) => {
    return new Promise( async resolve => {
        console.log(`PROCESSING ${accounts.length}`)
        accounts.forEach( async(ele) => {
            let plaidId = ele["plaidId"]
            if (merchants[plaidId] === "INVALID") {
                console.log("INVALID PAYMENT")
                return //dont process payment
            } else {

                let srcAcctId = await processSourceAccount(corpId, ele, sourceAccounts)//SWITCH TO CORPID
                let liabilityId = await processLiability(entityId, ele, merchants)
        
                console.log(`
                    Entity ID: ${entityId}, 
                    Corp ID: ${corpId}, 
                    Dest Account: ${liabilityId}, 
                    Source Acount ${srcAcctId}, 
                    Amount: ${ele["amount"]}
                `)

            }
        })
        resolve(true)
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


module.exports = processPayments