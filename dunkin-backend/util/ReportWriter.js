const fs = require('fs').promises
const path = require('path')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const basePath = path.join(__dirname,'..', '/outbound/reports')


async function writeDataToCSV(date, filename, label, data) {
    const header = [
        {id: label, title: label},
        {id: 'amount', title: 'amount'},
    ]

  let filePath = path.join(basePath, date, filename)

  await fs.mkdir(path.join(basePath, date), { recursive: true})

  const csvWriter = createCsvWriter({
    path: filePath,
    header: header,
    append: false
  });

  await csvWriter
    .writeRecords(data)

    console.log(`Data written to file ${filename} successfully.`);
  
  return true
}

function transformObject(obj, label) {
    const arr = [];
  
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        arr.push({
          [label]: key,
          "amount": obj[key]
        });
      }
    }
  
    return arr;
}

module.exports = {writeDataToCSV, transformObject}