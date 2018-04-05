  var socket = io();
  socket.on('connect',function() {
    console.log('Connected to server');
  });
  socket.on('disconnect',function() {
  console.log('Connection lost.. Trying to connect');
});
// socket.on('emailReceived', function(email){
//   console.log("New Email",email);
// });
socket.on('newMessage', function(msg){
  console.log("New message",msg);
});
socket.emit('createMsg', {
  to:'Money',
  msg:'Sure. My work is done'
});
// socket.emit('sendEmail',{
//   To :'sushmita@gmail.com',
//   Subject:'urgent'
// });
