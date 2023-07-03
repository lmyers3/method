const createEmployee = require('./employee')


const processPayments = async(payments, merchants, sourceAccounts) => {

    for (const empId of Object.keys(payments)) {
        //create individual entity
        const employee = payments[empId]
        let indvEntityId = await createEmployee(employee) 
        console.log("Processing entity for : "+indvEntityId)
        //process their payments
        //processPaymentsForEmployee(employee["accounts"])
    }

}

const processPaymentsForEmployee = async (accounts, merchants, sourceAccounts) => {

    accounts.forEach( (ele) => {
        if (merchants[ele["plaidId"]] === "INVALID") return
        //get src acct
        //link liabilbity
        //make payment
    })
} 


module.exports = processPayments