const fs = require('fs');
const path = require('path');


const findOutboundFiles = async (req, res, next)=> {
    console.log("finding outbound files")
    let paymentFiles = []
    
    let files = await findOutboundFilesHelper("staging")
    paymentFiles = paymentFiles.concat(files)

    files = await findOutboundFilesHelper("processed")
    paymentFiles = paymentFiles.concat(files)

    req["files"]= paymentFiles

    next()
}

const findOutboundFilesHelper = async (subdir) => {

    let paymentFiles = []
    let basePath = path.join(__dirname, "..", "outbound", subdir)

    let folderNames = await findFiles(basePath)

    let promises = folderNames.map( async folderName => {
        let fileNames = await findFiles(path.join(basePath, folderName))
        console.log(fileNames)
        fileNames.forEach( name => {

          let status
          if (subdir == 'staging') {
            status = 'staged'
          }
          else if (subdir == 'processed') {
            status = 'processed'
          }
          paymentFiles.push({"fileName":name, "date":folderName, "status":status})
        
        })
    })

    await Promise.all(promises)

    return paymentFiles
}

const findFiles = (basePath) => {
    return new Promise((resolve, reject) => {
      fs.readdir(basePath, (err, files) => {
        if (err) {
          console.error('Error reading folder:', err);
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  };

module.exports = findOutboundFiles