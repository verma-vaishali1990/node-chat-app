const path = require('path');
const http = require('http');
const express= require('express');
const socketIO = require('socket.io');

var port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const {generateMessage,generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  
  socket.on('join',(params,callback) =>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      return   callback('Name and Room name are required.');
    }
    console.log(`${params.name} is connected to ${params.room}`);
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
    callback();
  });

  socket.on('createMessage',(message,callback)=>{
    var user = users.getUser(socket.id);
    if(user && isRealString(message.msg)){
      io.to(user.room).emit('newMessage',generateMessage(user.name, message.msg));
    }
    callback('');
  });

  socket.on('createLocationMessage',(coords) =>{
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.lat, coords.long));
    }
  });

  socket.on('disconnect',()=>{
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList',user.room);
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
    }
      console.log(`${user.name} was disconnected from ${user.room}`);
  });
});

server.listen(port,()=>{
  console.log(`Server is up. Listening to ${port}`);
});
