const express = require('express');
const router = express.Router();

router.delete('/:id', (req, res) => {
    res.send("remove: " +  req.params.id);
})

module.exports = router;