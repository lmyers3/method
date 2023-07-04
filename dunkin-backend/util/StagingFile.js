const fs = require('fs').promises
const path = require('path')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const basePath = path.join(__dirname,'..', '/outbound/')

const header = [
  {id: 'employeeId', title: 'employeeId'},
  {id: 'dunkinBranchId', title: 'dunkinBranchId'},
  {id: 'dunkinStoreId', title: 'dunkinStoreId'},
  {id: 'firstName', title: 'firstName'},
  {id: 'lastName', title: 'lastName'},
  {id: 'routing', title: 'routing'},
  {id: 'srcAccountNumber', title: 'srcAccountNumber'},
  {id: 'srcAccountId', title: 'srcAccountId'},
  {id: 'destAccountNumber', title: 'destAccountNumber'},
  {id: 'destAccountId', title: 'destination'},
  {id: 'plaidId', title: 'plaidId'},
  {id: 'status', title: 'status'},
  {id: 'amount', title: 'amount'},
]


async function writeDataToCSV(date, filename, data) {
  let filePath = path.join(basePath, date, filename)
  await fs.mkdir(path.join(basePath, date), { recursive: true})

  await checkFileAndWriteHeader(filePath, header)

  const csvWriter = createCsvWriter({
    path: filePath,
    header: header,
    append: true
  });

  console.log(data)

  await csvWriter
    .writeRecords([data])

    console.log(`Data written to file ${filename} successfully.`);
  
  return true
}

const getDateString = () => {
    let today = new Date();

    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
    let yyyy = today.getFullYear();

    today = yyyy + '.' + mm + '.' + dd;

    return today
}

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

async function checkFileAndWriteHeader(filePath, header) {
  try {
    await fs.access(filePath);
    // The file exists, do nothing
  } catch {
    // The file does not exist, create it with headers
    const csvWriter = createHeaderWriter(filePath, header);
    await csvWriter.writeRecords([{}]); // Write an empty record to create the file
  }
}

function createHeaderWriter(filePath) {
  return createCsvWriter({
    path: filePath,
    header: header
  });
}

module.exports = {writeDataToCSV, generateRandomString, getDateString}