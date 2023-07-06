const fs = require('fs');
const csv = require('csv-parser');
const path = require('path')

const parseCsvFile = (req, res, next) => {
    let filePath = path.join(__dirname, '..', 'outbound', req.query["phase"], req.query["date"], req.query["fileName"])
    let index = 0;

    let summary = {
        "totalPayments": 0,
        "totalSuccess": 0,
        "totalRejected": 0,
        "payments": []
    }

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            index++;
            if (index == 1) return
            summary["totalPayments"]++;

            let status = req.query["phase"] === "staging" ? row["stagingStatus"] : row["paymentStatus"]

            if (status == "rejected") summary["totalRejected"]++
            if (status == "success") summary["totalSuccess"]++

            if (index <= 20) summary["payments"].push(row)
            
            console.log(row); 
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            req["summary"] = summary
            next()
        })
        .on('error', (err) => {
            console.error('An error occurred:', err);
            next(err);
        });


}

module.exports = parseCsvFile