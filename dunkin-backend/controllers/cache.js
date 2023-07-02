const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config()

const merchants = {}
const sourceAccounts = {}

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_KEY}`

const host = process.env.API_HOST
console.log("Host is: "+host)

let addSourceAccountToCache = (srcAccountNumber) => {
    if (sourceAccounts[srcAccountNumber]) return;

}

let addMerchantToCache = async (plaidId) => {
    if (merchants[plaidId]) {
        console.log("already exists")
        return;
    }
    const response = await axios.get(`${host}merchants?provider_id.plaid=${plaidId}`)
    merchants[plaidId] = response.data.data[0]["mch_id"]
}
 
module.exports = addMerchantToCache;