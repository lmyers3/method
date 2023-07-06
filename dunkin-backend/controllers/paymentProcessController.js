const fs = require('fs');
const csv = require('csv-parser');
const path = require('path')
const makePayment = require('./payment')
const {writePaymentToCSV, getDateString, renameFile, deleteFile} = require('../util/ProcessPaymentFile')


const processPayments = (req, res, next) => {
    let filePath = path.join(__dirname, '..', 'outbound', 'staging', req.query["date"], req.query["fileName"])
    let index = 0;
    let newFileName = req.query["fileName"].replace(".done", "") 
    let newDate = getDateString()

    const stream = fs.createReadStream(filePath).pipe(csv())

    let promiseQueue = Promise.resolve()

    stream
        .on('data', async (row) => {
            stream.pause()

            index++;
            if (index == 1) {
                stream.resume()
                return
            }

            promiseQueue = promiseQueue.then (async () => {

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
                        next(err);
                        return;
                    }
                }
                else if (row["stagingStatus"] === "rejected") {
                    row["paymentStatus"] = "rejected"
                    row["paymentId"] = null
                }
                await writePaymentToCSV(newDate, newFileName, row)
    
                console.log(row); 
                stream.resume();

            })

        })
        .on('end', async () => { 
            await promiseQueue; 
            console.log('CSV file successfully processed');
            let name = await renameFile(newDate, newFileName); 
            req["file"] = {
                "fileName": name,
                "date": newDate
            }
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




module.exports={processPayments, deleteStagedFile}