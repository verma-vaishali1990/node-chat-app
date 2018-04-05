const path = require('path');
const http = require('http');
const express= require('express');
const socketIO = require('socket.io');

var port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const {generateMessage,generateLocationMessage} = require('./utils/message.js');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New user connected');

  socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

  socket.broadcast.emit('newMessage',generateMessage('Admin','New user has joined chat room'));

  socket.on('createMessage',(message,callback)=>{
    console.log('Message sent',message);
    io.emit('newMessage',generateMessage(message.from, message.msg));
    callback('This is from server');
  });

  socket.on('createLocationMessage',(coords) =>{
    io.emit('newLocationMessage',generateLocationMessage('User',coords.lat, coords.long));
  });

  socket.on('disconnect',()=>{
    console.log('User was disconnected..');
  });
});

server.listen(port,()=>{
  console.log(`Server is up. Listening to ${port}`);
});
