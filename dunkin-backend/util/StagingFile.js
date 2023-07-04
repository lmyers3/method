const fs = require('fs').promises
const path = require('path')

const basePath = path.join(__dirname,'..', '/data/')

async function writeJsonToFile(filename, data) {
    let date = getDateString()
    let filePath = path.join(basePath, date, filename)
    try {
      let row = Object.values(data).join(',')+'\n'
      await fs.mkdir(path.join(basePath, date), { recursive: true})
      await fs.appendFile(filePath, row);
      console.log(`Data written to file ${filename} successfully.`);
    } catch (err) {
      console.error(`Error writing file: ${err}`);
    }
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
  

module.exports = {writeJsonToFile, generateRandomString}