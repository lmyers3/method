const fs = require('fs').promises
const path = require('path')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const basePath = path.join(__dirname,'..', '/outbound/processed')

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
  {id: 'stagingStatus', title: 'stagingStatus'},
  {id: 'paymentStatus', title: 'paymentStatus'},
  {id: 'paymentId', title: "paymentId"},
  {id: 'amount', title: 'amount'},
]


async function writePaymentToCSV(date, filename, data) {
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

const getDateString = () => {
    let today = new Date();

    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
    let yyyy = today.getFullYear();

    today = yyyy + '.' + mm + '.' + dd;

    return today
}

async function renameFile(date, filename) {
  const dirname = date;
  const extname = path.extname(filename);
  const basename = path.basename(filename, extname)
  const newFilePath = path.join(basePath, dirname, `${basename}.done${extname}`);

  await fs.rename(path.join(basePath, date, filename), newFilePath, (err) => {
    if (err) {
      console.error('An error occurred:', err);
    } else {
      console.log(`File was renamed to ${newFilePath}`);
    }
  });
  return `${basename}.done${extname}`
}


async function softDelFile(date, filename) {
    const dirname = date;
    const extname = path.extname(filename);
    const basename = path.basename(filename, extname);
    const newFilePath = path.join(__dirname,'..', '/outbound/staging', dirname, `${basename}.del${extname}`);
  
    await fs.rename(path.join(__dirname,'..', '/outbound/staging', date, filename), newFilePath, (err) => {
      if (err) {
        console.error('An error occurred:', err);
      } else {
        console.log(`File was renamed to ${newFilePath}`);
      }
    });
    return `${basename}.done${extname}`
  }

function deleteFile(filePath) {
    console.log("deleting...")
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error:', err);
                reject(err);
            } else {
                console.log('File deleted successfully');
                resolve(true);
            }
        });
    })
    .catch(err => console.error('Error while deleting file:', err));
}

  

module.exports = {writePaymentToCSV, deleteFile, softDelFile, getDateString, renameFile}