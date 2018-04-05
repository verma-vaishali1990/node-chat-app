  var socket = io();
  socket.on('connect',function() {
    console.log('Connected to server');
  });
  socket.on('disconnect',function() {
  console.log('Connection lost.. Trying to connect');
});

socket.on('newMessage', function(msg){
  console.log("New message ",msg);
  var li=jQuery('<li></li>');
  li.text(`${msg.from}: ${msg.msg}`);
  jQuery('#chats').append(li);
});

jQuery('#chat-form').on('submit',function (e){
  e.preventDefault();
  socket.emit('createMessage',{
    from:'User',
    msg:jQuery('[name=message]').val()
  },function(){

  });
});
