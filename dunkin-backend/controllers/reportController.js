const fs = require('fs');
const csv = require('csv-parser');
const path = require('path')
const Dinero = require('dinero.js')
const {writeDataToCSV, transformObject} = require('../util/ReportWriter')


const generateReport = (req, res, next) => {
    let filePath = path.join(__dirname, '..', 'outbound', 'processed', req.query["date"], req.query["fileName"])
    let index = 0;
    const type = req.query["type"]
    const label = type === "branch" ? "dunkinBranchId" : "srcAccountNumber"

    if (type === "all") next()

    const map = {} 

    const stream = fs.createReadStream(filePath).pipe(csv())

    stream
        .on('data', (row) => {
            stream.pause()

            index++; //skip first row
            if (index == 1) {
                stream.resume()
                return
            }

            if (row["paymentStatus"] === "success") {
                aggregate(row, map, label)
            }

            stream.resume()

        })
        .on('end', async () => { 
            let data = transformObject(map, label)
            console.log(data)
            await writeDataToCSV( req.query["date"],  req.query["fileName"], label, data)
            next()
        })
        .on('error', (err) => {
            console.error('An error occurred:', err);
            next(err);
        })

}

const aggregate = (row, map, label) => {
    let val = row[label]

    if (map[val]) {
        let prev = getDinero( map[val] )
        let add = getDinero(row["amount"])
        map[val] = prev.add(add).getAmount()
    } else {
        map[val] = getDinero(row["amount"]).getAmount()
    }
    
}


let getDinero = (amount) => Dinero({ amount: parseInt(amount) })



module.exports=generateReport