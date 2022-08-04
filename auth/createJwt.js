
const jwt = require('jsonwebtoken');

function createJwt(data) {
    exp = {
        expiresIn: "2h",
    }
    const token = jwt.sign(data, process.env.JWT_KEY, exp);
    //console.log(token);
    return token;
}

module.exports = createJwt;