const express = require('express');
const router = express.Router();

router.get('/cookies', (req,res) => {
    res.clearCookie('token');
    console.log('cookkkke')
})

module.exports = router