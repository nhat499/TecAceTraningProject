const express = require('express');
const app = express();
const parser = require('body-parser');
const verifyToken = require('./auth/verifyJwt').verifyToken;
const checkToken = require('./auth/verifyJwt').checkToken;
const cookieParser = require("cookie-parser");
require('dotenv').config();
let cors = require("cors");

const get = require('./routes/get.js');
const edit = require('./routes/edit.js');
const insert = require('./routes/insert.js');
const remove = require('./routes/remove.js');
const signIn = require('./routes/signIn.js');
const signOut = require('./routes/signOut.js');
const jwtInfo = require('./routes/security/jwtInfo.js');

app.get('/test', (req, res) => {
    res.send('test works');
  });

app.use(cookieParser());
app.use(cors({
  credentials: true, 
  origin: process.env.CLIENT_URL
}));
app.use(parser.json());
app.use('/get', checkToken, get);
app.use('/signIn', signIn);
app.use('/edit', verifyToken, edit);
app.use('/insert', verifyToken, insert);
app.use('/remove', verifyToken, remove);
app.use('/jwt', verifyToken, jwtInfo);
app.use('/signOut', verifyToken, signOut);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});