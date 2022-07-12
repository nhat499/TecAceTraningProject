const express = require('express');
const router = express.Router();

// edit topic
router.put("/:id", (req,res) => {
    res.send("edit id:" + req.params.id);
})

module.exports = router;