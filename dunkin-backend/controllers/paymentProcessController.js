const fs = require('fs');
const csv = require('csv-parser');
const path = require('path')
const makePayment = require('./payment')
const {writeBatchToCSV, softDelFile, getDateString, renameFile, deleteFile} = require('../util/ProcessPaymentFile')


const processPayments = (req, res, next) => {
    let filePath = path.join(__dirname, '..', 'outbound', 'staging', req.query["date"], req.query["fileName"])
    let index = 0;
    let newFileName = req.query["fileName"].replace(".done", "") 
    let newDate = getDateString()

    const stream = fs.createReadStream(filePath).pipe(csv())

    let payments = []

    let promiseArray = [];
    const batchSize = 500;  // Adjust this to an optimal value for your system
    
    let dataEventComplete = Promise.resolve();

    stream
        .on('data', (row) => {
            index++;
            if (index === 1) return;
    
            promiseArray.push(processRow(row));
    
            if (promiseArray.length === batchSize) {
                stream.pause();
                dataEventComplete = Promise.all(promiseArray)
                    .then(async (processedRows) => {
                        payments.push(...processedRows);
                        await writeBatchToCSV(newDate, newFileName, payments);
                        payments = [];
                    })
                    .catch(err => {
                        console.error('An error occurred:', err);
                        next(err);
                    })
                    .finally(() => {
                        promiseArray = [];
                        stream.resume();
                    });
            }
        })
        .on('end', async () => {
            try {
                // Wait for the last 'data' event handlers to complete
                await dataEventComplete;
    
                // Then handle remaining rows
                let processedRows = await Promise.all(promiseArray);
                payments.push(...processedRows);
                if (payments.length > 0) {
                    await writeBatchToCSV(newDate, newFileName, payments);
                    payments = [];
                }
    
                console.log('CSV file successfully processed');
                console.log(`Index is : ${index}`);
                await renameFile(newDate, newFileName);
                await softDelFile(req.query["date"], req.query["fileName"]);
                next();
            } catch(err) {
                console.error('An error occurred:', err);
                next(err);
            }
        })
        .on('error', (err) => {
            console.error('An error occurred:', err);
            next(err);
        });
    
    

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

async function processRow(row) {
    if (row["stagingStatus"] === "success") {
        try {
            let response = await makePayment(
                row["srcAccountId"],
                row["destination"],
                parseInt(row["amount"])
            ).catch(err => {
                throw new Error("Payment failed")
            })

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
    return row;
}



module.exports={processPayments, deleteStagedFile}