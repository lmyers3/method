const axios = require('axios');
const sharedResource = require("../util/SharedResource")

require('dotenv').config()

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_KEY}`

const host = process.env.API_HOST

const fetchCorpAccounts = (entityId, sourceAccounts) => {
    return new Promise( async(resolve) => {
        let response
        try {
            await sharedResource.waitForReady()
            response = await axios.get(`${host}accounts?holder_id=${entityId}`)
            let accounts = response?.data?.data
            accounts.forEach(ele => {
                sourceAccounts[ele["ach"]["number"]]=ele["id"]
            })
        } catch (error) {
            console.error('Error making the request', error)
            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
            }
        }
        resolve(response)
    })
}

const linkCorpAccount = (entityId, account, sourceAccounts) => {
    let routing = account['srcRouting']
    let acctNum = account['srcAccountNumber']
    let accountLink = {
        "holder_id": entityId,
        "ach": {
            "routing": routing,
            "number": acctNum,
            "type": "checking"
        }
    }
    return new Promise( async(resolve) => {
        let response
        try {
            await sharedResource.waitForReady()
            response = await axios.post(`${host}accounts`, accountLink)
        }catch (error) {
            console.error('Error making the request', error)
            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
            }
        }
        let acctId = response?.data?.data["id"]
        sourceAccounts[acctNum] = acctId
        resolve(acctId)
    })

}

const linkLiability = (entityId, account, merchants) => {
    let merchantId = merchants[account["plaidId"]]
    let liability = {
        "holder_id": entityId,
        "liability": {
            "mch_id": merchantId,
            "number": account["accountNumber"]
        }
    } 

    return new Promise( async(resolve) => {
        let response
        try {
            await sharedResource.waitForReady()
            response = await axios.post(`${host}accounts`, liability)
        } catch (error) {
            console.error('Error making the request', error)
            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
            }
        }
        let liabilityId = response?.data?.data["id"]
        resolve(liabilityId)
    })

}

module.exports = {fetchCorpAccounts, linkCorpAccount, linkLiability}