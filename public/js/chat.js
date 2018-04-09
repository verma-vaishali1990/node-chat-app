  var socket = io();

  function scrollToBottom (){
    var messages = jQuery('#chats');
    var newMessage = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=scrollHeight){
      messages.scrollTop(scrollHeight);
    };
  };
  socket.on('connect',function() {
    console.log('Connected to server');
    var params= jQuery.deparam(window.location.search);
    socket.emit('join', params ,function (error){
      if(error){
          alert(error);
          window.location.href="/";
      }else{
        console.log("you have joined room");
      }
    });
  });

  socket.on('disconnect',function() {
    console.log('Connection lost.. Trying to connect');
  });

  socket.on('updateUserList',function(users){
    var ol =jQuery('<ol></ol');
    users.forEach((function (user){
      ol.append(jQuery('<li></li>').text(user));
    }));
    jQuery('#users').html(ol);
    console.log('users lists ',users);
  });

socket.on('newMessage', function(msg){
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template ,{
    text: msg.msg,
    from:msg.from,
    createdAt : formattedTime
  });
  jQuery('#chats').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(msg){
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var template = jQuery('#location-template').html();
  var html =Mustache.render(template ,{
    from:msg.from,
    url :msg.url,
    createdAt:formattedTime
  });
  jQuery('#chats').append(html);
  scrollToBottom();
});

var messageTextBox= jQuery('[name=message]');
jQuery('#chat-form').on('submit',function (e){
  e.preventDefault();
  socket.emit('createMessage',{
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
