const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const payInstrController = require('../controllers/paymentinstruction')

const filePath = path.join(__dirname,'..', '/uploads/')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, filePath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

//create multer instance
var upload = multer({ storage: storage })

router.post('/payment-instruction', [upload.single("file"), payInstrController.execute], (req, res) => {
  res.json(req["outbound"])

})

module.exports = router;