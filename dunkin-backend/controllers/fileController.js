const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router()


const findOutboundFiles = async (req, res, next)=> {
    console.log("finding outbound files")
    let paymentFiles = []
    let basePath = path.join(__dirname, "..", "outbound")

    let folderNames = await findFiles(basePath)

    let promises = folderNames.map( async folderName => {
        let fileNames = await findFiles(path.join(basePath, folderName))
        console.log(fileNames)
        fileNames.forEach( name => paymentFiles.push({"fileName":name, "date":folderName}))
    })

    req["files"] = paymentFiles

    await Promise.all(promises)

    next()
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