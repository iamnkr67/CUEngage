const express = require("express");
const router = express.Router();
const {getAllSeat} = require('../controllers/seat_cntrl')


router.get('/', getAllSeat);


module.exports = router;