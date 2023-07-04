const axios = require('axios');
const sharedResource = require("../util/SharedResource")

require('dotenv').config()

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_KEY}`

const host = process.env.API_HOST

const createEmployee = (employee) => {
    return new Promise( async resolve => {
        console.log(`creating employee for ${employee['firstName']}`)
        let firstName = employee["firstName"]
        let lastName = employee["lastName"]
    
        let entity = {
            "type": "individual",
            "individual": {
                "first_name": firstName,
                "last_name": lastName,
                "phone": "+15121231111"
            }
        }

        let response
        try {
            await sharedResource.waitForReady()
            response = await axios.post(`${host}entities`, entity)
        } catch (error) {
            console.error('Error making the request', error)
            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
            }
        }
        let entityId = response?.data?.data["id"]
        console.log(`entityId is : ${entityId}`)
        resolve(entityId)
    })

}

module.exports = createEmployee