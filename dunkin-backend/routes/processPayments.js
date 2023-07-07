const express = require('express');
const router = express.Router()
const {processPayments} = require('../controllers/paymentProcessController')


router.get('/process', processPayments, (req, res) => {

  res.json( {
    "message": "Successfully initiated payment process",
    "success": true
  } )

})

module.exports = router