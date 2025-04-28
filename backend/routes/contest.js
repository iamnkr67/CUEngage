const express = require("express");
const router = express.Router();
const { add,getdata } = require("../controllers/contestant"); 

router.post("/", add); 
router.get('/getData', getdata);

module.exports = router;





