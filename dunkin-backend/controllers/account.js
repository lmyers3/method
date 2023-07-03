const axios = require('axios');

require('dotenv').config()

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_KEY}`

const host = process.env.API_HOST

const fetchCorpAccounts = (entityId, sourceAccounts) => {
    return new Promise( async(resolve) => {
        let response
        try {
            response = await axios.get(`${host}accounts?holder_id=${entityId}`)
            let accounts = response.data.data
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

const linkCorpAccount = (entityId, chunk, sourceAccounts) => {
    let routing = chunk["Payor"]["ABARouting"]
    let acctNum = chunk["Payor"]["AccountNumber"]
    let account = {
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
            response = await axios.post(`${host}accounts`, account)
        }catch (error) {
            console.error('Error making the request', error)
            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
            }
        }
        let acctId = response.data["id"]
        console.log(acctId)
        sourceAccounts[acctNum] = acctId
        resolve(acctId)
    })

}

module.exports = fetchCorpAccounts