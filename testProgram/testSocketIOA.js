console.log("A started");

var socketB = require('./testSocketIOB.js');
var message = "Kim Jong Un loves Donald Trump";

var io = require('socket.io')();

io.on('connection', function(socket){
  socket.emit('broadcast',message);
});

io.listen(3000);



io.emit('channel1', message);
