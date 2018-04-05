  var socket = io();
  socket.on('connect',function() {
    console.log('Connected to server');
  });
  socket.on('disconnect',function() {
  console.log('Connection lost.. Trying to connect');
});

socket.on('newMessage', function(msg){
  var li=jQuery('<li></li>');
  li.text(`${msg.from}: ${msg.msg}`);
  jQuery('#chats').append(li);
});

socket.on('newLocationMessage', function(msg){
  var li=jQuery('<li></li>');
  var a =jQuery('<a target="_blank">My current location</a>');
  li.text(`${msg.from}: `);
  a.attr('href',msg.url);
  li.append(a);
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

var locationButton = jQuery('#share-location');
locationButton.on('click',function(e){
  e.preventDefault();
  if(!navigator.geolocation){
    return alert('Location not supported by browser');
  }
  navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMessage',{
      lat: position.coords.latitude,
      long: position.coords.longitude
    });
  },function(){
    alert('Unable to fetch location.');
  });

});
