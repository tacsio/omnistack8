const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const serverHttp  = require('http').Server(app)
const io = require('socket.io')(serverHttp);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  connectedUsers[user] = socket.id;
});

//const connectionUrl = "mongodb://192.168.99.100:27017/omnistack";
const connectionUrl = "mongodb://localhost:27017/omnistack";

mongoose.connect(connectionUrl, {
  useNewUrlParser: true
});

//interceptor
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});
app.use(cors());
app.use(express.json());
app.use(routes);

serverHttp.listen(3333);