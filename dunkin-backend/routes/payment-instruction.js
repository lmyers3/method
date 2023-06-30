const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..', '/uploads/'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
//create multer instance
var upload = multer({ storage: storage })

router.post('/payment-instruction', upload.array("file"), (req, res) => {
    res.json({status: "files recieved"})
})

module.exports = router;