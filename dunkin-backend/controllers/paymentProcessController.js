const fs = require('fs');
const csv = require('csv-parser');
const path = require('path')
const makePayment = require('./payment')
const {softDelFile, writePaymentToCSV, getDateString, renameFile, deleteFile} = require('../util/ProcessPaymentFile')


const processPayments = (req, res, next) => {
    let filePath = path.join(__dirname, '..', 'outbound', 'staging', req.query["date"], req.query["fileName"])
    let index = 0;
    let newFileName = req.query["fileName"].replace(".done", "") 
    let newDate = getDateString()

    const stream = fs.createReadStream(filePath).pipe(csv())

    let promiseQueue = Promise.resolve()

    stream
        .on('data', (row) => {
            promiseQueue = promiseQueue
            .then(() => next())
            .then(() => index++)
            .then(() => processRow(newDate, newFileName, row, index))

        })
        .on('end', async () => { 
            await promiseQueue; 
            console.log('CSV file successfully processed');
            await renameFile(newDate, newFileName); 
            await softDelFile(req.query["date"], req.query["fileName"])
            next()
        })
        .on('error', (err) => {
            console.error('An error occurred:', err);
            next(err);
        })

}

const deleteStagedFile = async (req, res, next) => {
    let filePath = path.join(__dirname, '..', 'outbound', 'staging', req.query["date"], req.query["fileName"])
    try {
        await deleteFile(filePath);
        next();
    } catch (error) {
        console.error('Error:', error);
        next(error);
    }
}

async function processRow(newDate, newFileName, row, index) {
    if (index === 1) return
    if (row["stagingStatus"] === "success") {
        try {
            let response = await makePayment(
                row["srcAccountId"],
                row["destination"],
                parseInt(row["amount"])
            )
            row["paymentStatus"] = response["success"] ? "success" : "rejected"
            row["paymentId"] = response["data"]["id"]
        } catch (err) {
            console.error('An error occurred while making the payment:', err);
            row["paymentStatus"] = "rejected"
            row["paymentId"] = null
        }
    }
    else if (row["stagingStatus"] === "rejected") {
        row["paymentStatus"] = "rejected"
        row["paymentId"] = null
    }
    await writePaymentToCSV(newDate, newFileName, row)
}




module.exports={processPayments, deleteStagedFile}