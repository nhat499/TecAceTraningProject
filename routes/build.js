const express = require('express');
const router = express.Router();

// create topic
router.post('/', (req,res) => {
    res.send("create topic");
});

module.exports = router;