var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000');

//console.log("starting");

var status = {
  gamepad: {
    drive: 0,
    strafe: 0,
    rotate: 0,
    upDown: 0,
    tilt: 0,
    XButton: false,
    fineControlToggle: false
  },
  profile: {
    HFL: 0,
  },
  thrust: {
    HFL: 0,
    HFR: 0,
    HRL: 0,
    HRR: 0,
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
    ch2: true
  },
  message: []
};

socket.on('drive', function(value) {
  status.gamepad.drive = value;
});

socket.on('strafe', function(value) {
  status.gamepad.strafe = value;
});

socket.on('rotate', function(value) {
  status.gamepad.rotate = value;
});

socket.on('upDown', function(value) {
  status.gamepad.upDown = value;
});

socket.on('tilt', function(value) {
  status.gamepad.tilt = value;
});


socket.on('thrusterControl.thrust.HRR', function(_thrust) {
  status.profile.HRR = _thrust;
});



socket.on('thruster.thrust.HFL', function(_thrust) {
  status.thrust.HFL = _thrust;
});

socket.on('thruster.thrust.HFR', function(_thrust) {
  status.thrust.HFR = _thrust;
});

socket.on('thruster.thrust.HRL', function(_thrust) {
  status.thrust.HRL = _thrust;
});

socket.on('thruster.thrust.HRR', function(_thrust) {
  status.thrust.HRR = _thrust;
});



socket.on('thruster.thrust.VF', function(_thrust) {
  status.thrust.VF = _thrust;
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

function gaugeLine(outputBuffer, name, value) {
  if(isNaN(value) || value == null) value = 0;
  return new Line(outputBuffer)
    .column(name, 13)
    .column(Gauge(value + 1, 2, 40, 2, value.toFixed(3)),80)
    .fill()
    .store();
}

function booleanLine(outputBuffer, name, nameWidth, value, _true, _false) {
  var line = new Line(outputBuffer)
    .column(name, nameWidth)
    .column(value == 1?  _true : _false ,50)
    .fill()
    .store();
}

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

  gaugeLine(outputBuffer, "Drive", status.gamepad.drive);

  gaugeLine(outputBuffer, "Strafe", status.gamepad.strafe);

  gaugeLine(outputBuffer, "Rotate", status.gamepad.rotate);

  gaugeLine(outputBuffer, "upDown", status.gamepad.upDown);

  gaugeLine(outputBuffer, "tilt", status.gamepad.tilt);

  var blankLine = new Line(outputBuffer).fill().store();

  gaugeLine(outputBuffer, "Thruster profile HRR", status.profile.HRR);

  var blankLine = new Line(outputBuffer).fill().store();

  gaugeLine(outputBuffer, "Thruster HFL", status.thrust.HFL);

  gaugeLine(outputBuffer, "Thruster HFR", status.thrust.HFR);

  gaugeLine(outputBuffer, "Thruster HRL", status.thrust.HRL);

  gaugeLine(outputBuffer, "Thruster HRR", status.thrust.HRR);

  gaugeLine(outputBuffer, "Thruster VF", status.thrust.VF);

  gaugeLine(outputBuffer, "Thruster VR", status.thrust.VR);




  booleanLine(outputBuffer, "Direction: ", 11, status.thrust.direction, "Front", "Rear");

  booleanLine(outputBuffer, "fineCoarse: ", 12, status.thrust.fineCoarse, "Fine", "Coarse");


  booleanLine(outputBuffer, "Video Channel 1: : ", 17, status.video.ch1, "CAM 1", "CAM 2");

  booleanLine(outputBuffer, "Video Channel 2: : ", 17, status.video.ch2, "CAM 3", "CAM 4");


  clear();
  outputBuffer.output();
}


//***********
exports.init = function() {
  setInterval(function() {
    draw();
  },50);
}
