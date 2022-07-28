const express = require('express');
const router = express.Router();
const axios = require('axios');
const fetchXMLInfo = require('../utils/fetchSignInfo.js');
const createJwt = require('../auth/createJwt.js');
const util = require('../utils/queries.js');

router.get('/start', (req, res) => {
    const client_id = '3694457r8f';
    const state = 'signout';
    const signOutRedirect = process.env.CLIENT_URL;
    const url = `https://stg-account.samsung.com/accounts/v1/STWS/signOutGate?client_id=${client_id}&state=${state}&signOutURL=${signOutRedirect}`;
    res.clearCookie('token');
    res.redirect(url);
})


module.exports = router;