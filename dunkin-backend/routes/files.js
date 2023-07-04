const express = require('express');
const router = express.Router()
const findOutboundFiles = require('../controllers/fileController')


router.get('/files', findOutboundFiles, (req, res) => {

  res.json(req["files"])

})

module.exports = router