const axios = require('axios');
const sharedResource = require("../util/SharedResource")

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_KEY}`

const host = process.env.API_HOST

const makePayment = (source, destination, amount) => {
    let payment = {
        "amount": amount,
        "source": source,
        "destination": destination,
        "description": "Simple Pmt"
    }
    return new Promise( async (resolve, reject) => {
        let response 
        try {
            await sharedResource.waitForReady()
            response = await axios.post(`${host}payments`, payment)
            
        } catch (error) {
            console.error('Error making the request', error)
            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
            }
            reject("Error while processing payment")
        }

        resolve(response.data)
    }) 
}

module.exports= makePayment
