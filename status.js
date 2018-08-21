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
