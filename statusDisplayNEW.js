var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000');

//console.log("starting");

var status = {
  gamepad: {
    leftX: 0,
    leftY: 0,
    rightX: 0,
    rightY: 0,
    XButton: false,
    fineControlToggle: false
  },
  thrust: {
    HL: 0,
    HR: 0,
    VL: 0,
    VR: 0,
    fineCoarse: true,
    direction: 1,
  },
  manipulator: {
    EM1: false,
    EM2: false,
    DTMFencoder: 0    //0: not playing, 1: playing
  },
  depth: {
    raw: 0,
    mBar: 0,
    cm: 0,
    cmTared: 0,
    tare: 0,
    zero: 0,
  },
  video: {
    ch1: true,
    ch2: false
  },
  message: []
};

socket.on('gamepad.leftJoystick', function(value) {
  status.gamepad.leftX = value.x;
  status.gamepad.leftY = value.y;
});

socket.on('gamepad.rightJoystick', function(value) {
  status.gamepad.rightX = value.x;
  status.gamepad.rightY = value.y;
});



socket.on('thruster.thrust.HL', function(_thrust) {
  status.thrust.HL = _thrust;
});

socket.on('thruster.thrust.HR', function(_thrust) {
  status.thrust.HR = _thrust;
});

socket.on('thruster.thrust.VL', function(_thrust) {
  status.thrust.VL = _thrust;
});

socket.on('thruster.thrust.VR', function(_thrust) {
  status.thrust.VR = _thrust;
});


socket.on('profile.direction', function(_direction) {
  status.thrust.direction = _direction;
});

socket.on('profile.fineCoarse', function(_fineCoarse) {
  status.thrust.fineCoarse = _fineCoarse;
});


socket.on('CAM.ch1', function(_channel) {
  status.video.ch1 = _channel;
})

socket.on('CAM.ch2', function(_channel) {
  status.video.ch2 = _channel;
})


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
    .column("LeftX",13)
    .column(Gauge(status.gamepad.leftX + 1, 2, 40, 2, status.gamepad.leftX.toFixed(3)),80)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("LeftY",13)
    .column(Gauge(status.gamepad.leftY + 1, 2, 40, 2, status.gamepad.leftY.toFixed(3)),80)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("RightX",13)
    .column(Gauge(status.gamepad.rightX + 1, 2, 40, 2, status.gamepad.rightX.toFixed(3)),80)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("RightY",13)
    .column(Gauge(status.gamepad.rightY + 1, 2, 40, 2, status.gamepad.rightY.toFixed(3)),80)
    .fill()
    .store();


  var blankLine = new Line(outputBuffer)
    .fill()
    .store();

  var blankLine = new Line(outputBuffer)
    .fill()
    .store();


  var line = new Line(outputBuffer)
    .column("Thruster HL: ",13)
    .column(Gauge(status.thrust.HL + 1, 2, 40, 2, status.thrust.HL.toFixed(3)),60)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("Thruster HR: ",13)
    .column(Gauge(status.thrust.HR + 1, 2, 40, 2, status.thrust.HR.toFixed(3)),60)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("Thruster VL: ",13)
    .column(Gauge(status.thrust.VL + 1, 2, 40, 2, status.thrust.VL.toFixed(3)),60)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("Thruster VR: ",13)
    .column(Gauge(status.thrust.VR + 1, 2, 40, 2, status.thrust.VR.toFixed(3)),60)
    .fill()
    .store();



  var line = new Line(outputBuffer)
    .column("Direction: ",11)
    .column(status.thrust.direction == 1? "Front" : "Rear",50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("fineCoarse: ",12)
    .column(status.thrust.fineCoarse? "Fine" : "Coarse",50)
    .fill()
    .store();


  var line = new Line(outputBuffer)
    .column("Video Channel 1: ",17)
    .column(status.video.ch1? "CAM 1" : "CAM 2",50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("Video Channel 2: ",17)
    .column(status.video.ch2? "CAM 3" : "CAM 4",50)
    .fill()
    .store();

  clear();
  outputBuffer.output();
}


//***********
exports.init = function() {
  setInterval(function() {
    draw();
  },50);
}
