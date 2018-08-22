var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000');

var status = {
  gamepad: {
    leftX: 0,
    leftY: 0,
    rightX: 0,
    rightY: 0,
    direction: 1,
    XButton: false,
    fineControlToggle: false
  },
  thrust: {
    HL: 0,
    HR: 0,
    VL: 0,
    VR: 0,
    fineCoarse: true,
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

// SHOULD THIS BE HERE OR IN thrustProfile
socket.on('gamepad.circle', function() {
  status.gamepad.direction *= -1;
  socket.emit('profile.direction', status.gamepad.direction);
});

socket.on('gamepad.x', function() {
  if(status.thrust.fineCoarse) {
    status.thrust.fineCoarse = false;
  } else {
    status.thrust.fineCoarse = true;
  }

  socket.emit('profile.fineCoarse', status.thrust.fineCoarse);
})

//electromagnet
socket.on('gamepad.l1', function() {
  if(status.manipulator.EM1) {
    status.manipulator.EM1 = false;
  } else {
    status.manipulator.EM1 = true;
  }

  socket.emit('EM1', status.manipulator.EM1);
})


socket.on('gamepad.r1', function() {
  if(status.manipulator.EM2) {
    status.manipulator.EM2 = false;
  } else {
    status.manipulator.EM2 = true;
  }

  socket.emit('EM2', status.manipulator.EM2);
})

//servo
var _micros = 1500;
socket.on('gamepad.dpadUp', function() {
  if(status.video.ch1) {
    //servoControl.servo(0x02,1500);
    _micros = 1500;
    status.video.ch1 = false;
  } else {
    //servoControl.servo(0x02,1100);
    _micros = 1100;
    status.video.ch1 = true;
  }

  socket.emit('servo', {command:0x02, micros: _micros});
  //console.log('_micros: ' + _micros);
  socket.emit('CAM.ch1', status.video.ch1);
})
