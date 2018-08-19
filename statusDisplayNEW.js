var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000');

console.log("starting");

var status = {
  thrust: {
    HL: 0,
    HR: 0,
    VL: 0,
    VR: 0
  }
};

socket.on('thruster.thrust.HL', function(_thrust) {
  console.log(_thrust);
  status.thrust.HL = _thrust;
});

var CLI         = require('clui'),
    clc         = require('cli-color'),
    Line        = CLI.Line,
    LineBuffer  = CLI.LineBuffer,
    clear       = CLI.Clear,
    Gauge       = CLI.Gauge;

var gaugeArr = [];
var drawTimeout;

function draw() {
  var outputBuffer = new LineBuffer({
    x: 0,
    y: 0,
    width: 80,
    height: 40
  });

  var outputBuffer = new LineBuffer({
    x: 0,
    y: 0,
    width: 'console',
    height: 'console'
  });

  var gaugeWidth = 30;

  var line = new Line(outputBuffer)
    .column("Thruster HL: ",13)
    .column(Gauge(status.thrust.HL + 1, 2, 40, 2, status.thrust.HL.toFixed(3)),60)
    .fill()
    .store();

  clear();
  outputBuffer.output();
}


//***********
init = function() {
  setInterval(function() {
    draw();
  },50);
}

init();
