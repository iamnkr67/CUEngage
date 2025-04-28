const express = require('express');
const router = express.Router();
const upload = require("../middleware/fileUpload")
const { addEvent, getAllEvent, updateEvent, deleteEvent } = require("../controllers/eventController");

router.post('/add', upload.fields([{ name: "poster" },{name:"eFile"}]), addEvent);
router.get('/getAll', getAllEvent);
router.put('/update/:id',upload.fields([{ name: "poster" },{name:"eFile"}]),updateEvent);
router.delete('/delete/:id', deleteEvent);
module.exports = router;