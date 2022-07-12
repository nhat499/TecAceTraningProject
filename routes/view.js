const express = require('express');
const router = express.Router();

// get one topic
router.get("/:id", (req,res) => {
    console.log(req.params.id);
    res.send("get topic:"+  req.params.id);
});


// get all topic
router.get("/", (req, res) => {
    console.log("gett all topic");
    res.send("get all topic");
})

module.exports = router;