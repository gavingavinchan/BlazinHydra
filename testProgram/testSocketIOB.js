var io = require('socket.io')();


var message = "not recieved";

console.log("B started");

io.on('connection', function(socket){
  //message = client;
  socket.on('reply', function(_message) {
    message = _message;
  });
});

io.on('channel1', function(_message) {
  console.log(_message);
})

console.log("Message is " + message);
