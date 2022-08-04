const express = require('express');
const router = express.Router();
const axios = require('axios');
const fetchXMLInfo = require('../utils/fetchSignInfo.js');
const createJwt = require('../auth/createJwt.js');
const util = require('../utils/queries.js');

// begin sign in
// send user to samsung server
router.get('/start', async(req, res) => {
    console.log('sign in begin: my server');
    // build url
    const response_type= 'code';
    const locale='en';
    const countryCode='US';
    const client_id='3694457r8f';
    const redirect_uri=`${process.env.SERVER_URL}/signIn/next`;
    const state='state';
    const goBackURL=`${process.env.SERVER_URL}/signIn/cancel`;
    const url = `https://stg-account.samsung.com/accounts/v1/STWS/signInGate?response_type=${response_type}&locale=${locale}&countryCode=${countryCode}&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&goBackURL=${goBackURL}`;
    res.status(200).send({
        message: 'ok',
        link: url
    });
});

// if user successfully sign in
// redirect back to home page
// create jwt and store in cookies
router.get('/next', async(req, res) => {
    if (req.query.code) {
        const url = `https://${req.query.auth_server_url}/auth/oauth2/token`
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', req.query.code);
        params.append('client_id', '3694457r8f');
        params.append('client_secret', 'ECF8F31E32F6DA9DC17C7704A1A4DE47');
        axios.post(url, params)
            .then((res2)=> {
                fetchXMLInfo(req.query.api_server_url, res2.data)
                .then( async (profile) => {
                    const jwt = await updateDbCreateJwt(profile);
                    res.cookie('token', jwt, {httpOnly:true}); 
                    res.redirect(`${process.env.CLIENT_URL}/home/`);
                })
            })
    }
});

// if user is not currently in database
// add them
// formate data for jwt
async function updateDbCreateJwt(profile) {
    const userId = profile.guid;
    const firstName = profile.firstName;
    const lastName = profile.lastName;
    let profileImg = profile.profileImg;
    if (profileImg === '') profileImg = 'https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg';
    //if (!(await util.isValid(userId, 'user'))) { // user is not in db
    await util.insertUser(userId, firstName, lastName, profileImg);
    //}
    const data = {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        profileImg: profileImg
    }
    const jwt = createJwt(data);
    return jwt;

}

// if user unsuccessful in signing in
router.get('/cancel', async(req, res) => {
    console.log("cancel: here");
    console.log(req);
});

module.exports = router;