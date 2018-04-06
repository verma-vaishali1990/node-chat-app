  var socket = io();
  socket.on('connect',function() {
    console.log('Connected to server');
  });
  socket.on('disconnect',function() {
  console.log('Connection lost.. Trying to connect');
});

socket.on('newMessage', function(msg){
  console.log(msg);
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var li=jQuery('<li></li>');
  li.text(`${msg.from} ${formattedTime}: ${msg.msg}`);
  jQuery('#chats').append(li);
});

socket.on('newLocationMessage', function(msg){
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var li=jQuery('<li></li>');
  var a =jQuery('<a target="_blank">My current location</a>');
  li.text(`${msg.from} ${formattedTime} : `);
  a.attr('href',msg.url);
  li.append(a);
  jQuery('#chats').append(li);
});

var messageTextBox= jQuery('[name=message]');
jQuery('#chat-form').on('submit',function (e){
  e.preventDefault();
  socket.emit('createMessage',{
    from:'User',
    msg:messageTextBox.val()
  },function(){
      messageTextBox.val("");
  });
});

var locationButton = jQuery('#share-location');
locationButton.on('click',function(e){
  e.preventDefault();
  if(!navigator.geolocation){
    return alert('Location not supported by browser');
  }
  locationButton.attr("disabled","disabled").text('Sharing location..');
  navigator.geolocation.getCurrentPosition(function(position){
      locationButton.removeAttr("disabled").text('Share location');
    socket.emit('createLocationMessage',{
      lat: position.coords.latitude,
      long: position.coords.longitude
    });
  },function(){
      locationButton.removeAttr("disabled");
    alert('Unable to fetch location.');
  });

});
