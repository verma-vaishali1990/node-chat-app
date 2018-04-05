const path = require('path');
const http = require('http');
const express= require('express');
const socketIO = require('socket.io');

var port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New user connected');

  // socket.emit('emailReceived',{
  //   from:'vaishali@gmail.com',
  //   createdAt:'5/4/2018'
  // });
  //
  // socket.on('sendEmail',(data) =>{
  //   console.log('email sent :',data);
  // });
  //


  socket.emit('newMessage',{
    from:'Admin',
    msg:'Welcome to the chat app'
  });
  socket.broadcast.emit('newMessage',{
    from:'Admin',
    msg:'New use rhas joined chat room'
  });
  socket.on('createMsg',(message)=>{
    console.log('Message sent',message);
    io.emit('newMessage',{
      from:message.from,
      msg:message.msg
    });
    // socket.broadcast.emit('newMessage',{
    //   from:message.from,
    //   msg:message.msg
    // });
  });

  socket.on('disconnect',()=>{
    console.log('User was disconnected..');
  });
});

server.listen(port,()=>{
  console.log(`Server is up. Listening to ${port}`);
});
