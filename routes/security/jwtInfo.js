const express = require('express');
const router = express.Router();


router.get('/user', (req, res) => {
    const userInfo = req.user;
    if (userInfo) res.status(200).send({status:200, userInfo: userInfo})
    else res.status(401).send({status: 401, userInfo:undefined})
});


module.exports = router;