const express = require('express');
const router = express.Router()
const path = require('path')
const generateReport = require('../controllers/reportController')

const basePath = path.join(__dirname,'..', '/outbound/reports')

router.get('/report', generateReport, (req, res) => {

    const filePath = path.join(basePath, req.query['date'], req.query['fileName']);

    let newFileName = req.query['type'] + "_" + req.query['fileName']

    // Set the headers to instruct the browser to ask the user to save the downloaded file
    res.setHeader('Content-Disposition', 'attachment; filename=' +  newFileName);

    // Send the file to the client
    res.sendFile(filePath, err => {
        if (err) {
        // If there's an error, send a 404 error to the client
        console.log(err);
        res.sendStatus(404);
        }
    });



//   const readStream = fs.createReadStream(outboundPath)

//   readStream.pipe(res)

})

module.exports = router