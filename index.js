const express = require('express');
const app = express();
const cors = require("cors");
const parser = require('body-parser');
// const path = require('path');
const http = require('http');
const {Server} = require('socket.io');
const corHeader = require('./utils/access_control.js');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://34.216.189.30'],
    allowedHeaders: ['origin', 'X-Requested-With','content-type','X-Auth-Token'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    supports_credentials:true,
    credentials: true
  }
})

const io2 = io;
//const io2 = io.of('/api/');

app.use(cors({
  origin: ['http://localhost:3000', 'http://34.216.189.30'],
    allowedHeaders: ['origin', 'X-Requested-With','content-type','X-Auth-Token'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    supports_credentials:true,
    credentials: true,
    'Access-Control-Allow-Origin': 'origin'
}));

const verifyToken = require('./auth/verifyJwt').verifyToken;
const checkToken = require('./auth/verifyJwt').checkToken;
const cookieParser = require("cookie-parser");
require('dotenv').config();


const get = require('./routes/get.js');
const edit = require('./routes/edit.js');
const insert = require('./routes/insert.js');
const remove = require('./routes/remove.js');
const signIn = require('./routes/signIn.js');
const signOut = require('./routes/signOut.js');
const jwtInfo = require('./routes/security/jwtInfo.js');
const cookie = require('./auth/clearCookies.js');


app.get('/test', (req, res) => {
    res.send('test works');
});



app.use(cookieParser());

app.use(parser.json());
app.use('/get',checkToken, get);
app.use('/signIn',signIn);
app.use('/edit',verifyToken, edit);
app.use('/insert',verifyToken, insert);
app.use('/remove',verifyToken, remove);
app.use('/jwt', verifyToken, jwtInfo);
app.use('/signOut', verifyToken, signOut);
app.use('/clear', cookie)


io2.on('connection', (socket) => {
  console.log(`a new connection: ${socket.id}`);

  socket.on('topicUpdated', () => {
    io2.emit("topicUpdated");
  });

  socket.on('singleTopicRefetch', () => {
    io2.emit("singleTopicRefetch");
  })

  socket.on('commentUpdated', () => {
    io2.emit("commentUpdated");
  });

  socket.on('replyUpdated', () => {
    io2.emit("replyUpdated");
  });

  socket.on('navigateBack', () => {
    io2.emit('navigateBack')
  })

  socket.on('disconnect', () => {
    console.log('a disconnected:', socket.id);
  })
});


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}...`);
// });