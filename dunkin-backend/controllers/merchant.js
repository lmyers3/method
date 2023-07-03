const axios = require('axios');

require('dotenv').config()


axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_KEY}`

const host = process.env.API_HOST
console.log("Host is: "+host)


const findMerchantId = (plaidId, merchants) => {
    return new Promise( async (resolve) => {
        if (merchants[plaidId]) { resolve(true) }
        else {
            let response
            try {
                response = await axios.get(`${host}merchants?provider_id.plaid=${plaidId}`)
            } catch (error) {
                console.error('Error making the request', error)
                if (error.response) {
                    console.log('Response data:', error.response.data);
                    console.log('Response status:', error.response.status);
                }
            }
            if (!response.data.data?.length) {
                merchants[plaidId] = "INVALID"
                resolve(false)
            } else {
                let mch_id = response.data.data[0].mch_id
                merchants[plaidId] = mch_id
                resolve(response)
            }

        }
    })
}



 
module.exports = findMerchantId;