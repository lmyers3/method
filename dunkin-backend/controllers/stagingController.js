const fs = require('fs');
const csv = require('csv-parser');
const path = require('path')

const parseCsvFile = (req, res, next) => {
    let filePath = path.join(__dirname, '..', 'outbound', 'staging', req.query["date"], req.query["fileName"])
    let index = 0;

    let summary = {
        "totalPayments": 0,
        "totalSuccess": 0,
        "totalRejected": 0
    }

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            index++;
            if (index == 1) return
            summary["totalPayments"]++;
            if (row["stagingStatus"] == "rejected") summary["totalRejected"]++
            if (row["stagingStatus"] == "success") summary["totalSuccess"]++
            
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