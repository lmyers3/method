const express = require('express');
const router = express.Router()
const parseCsvFile = require('../controllers/summaryController')


router.get('/staging', parseCsvFile, (req, res) => {
    res.json(req["summary"])

})

module.exports = router