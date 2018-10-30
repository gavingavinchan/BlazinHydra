var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000');

var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");

controller.connect();

var status = {
  gamepad: {
    leftX: 0,
    leftY: 0,
    rightX: 0,
    rightY: 0,
    l2: 0,
    r2: 0,
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
    ch2: true
  },
  message: []
};

//Thrusters
function normalize(x) {
  return (x - 255/2)/(255/2);
}



controller.on("left:move", function(value) {
  let gp = status.gamepad;
  gp.leftX = normalize(value.x);
  gp.leftY = -normalize(value.y);

  //socket.emit('gamepad.leftJoystick', {x: gp.leftX, y: gp.leftY});
  socket.emit('drive', gp.leftY);
  socket.emit('rotate', gp.leftX);
})

controller.on("right:move", function(value) {
  let gp = status.gamepad;

  gp.rightX = normalize(value.x);
  gp.rightY = -normalize(value.y);

  socket.emit('strafe', gp.rightX);
  socket.emit('upDown', gp.rightY);
})


controller.on("l2:change", function(value) {
  let gp = status.gamepad;
  gp.l2 = value/255;
  socket.emit('tilt', gp.r2 - gp.l2);
})

controller.on("r2:change", function(value){
  let gp = status.gamepad;
  gp.r2 = value/255;
  socket.emit('tilt', gp.r2 - gp.l2);
})



controller.on("circle:press", function() {
  status.gamepad.direction *= -1;
  socket.emit('profile.direction', status.gamepad.direction);
});

controller.on("x:press", function() {
  if(status.thrust.fineCoarse) {
    status.thrust.fineCoarse = false;
  } else {
    status.thrust.fineCoarse = true;
  }

  socket.emit('profile.fineCoarse', status.thrust.fineCoarse);
})


//electromagnet
controller.on("l1:press", function(){
  let _strength = 0;
  if(status.manipulator.EM1) {
    status.manipulator.EM1 = false;
    _strength = 0;
  } else {
    status.manipulator.EM1 = true;
    _strength = 255;
  }

  socket.emit('EM1', {strength: _strength, boolean: status.manipulator.EM1});
})


controller.on("r1:press", function(){
  let _strength = 0;
  if(status.manipulator.EM2) {
    status.manipulator.EM2 = false;
    _strength = 0;
  } else {
    status.manipulator.EM2 = true;
    _strength = 255;
  }

  socket.emit('EM2', {strength: _strength, boolean: status.manipulator.EM2});
})


//servo
controller.on("dpadUp:press", function() {
  let _micros = 1500;
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


controller.on("dpadLeft:press", function() {
  let _micros = 1500;
  if(status.video.ch2) {
    //servoControl.servo(0x02,1500);
    _micros = 1500;
    status.video.ch2 = false;
  } else {
    //servoControl.servo(0x02,1100);
    _micros = 1100;
    status.video.ch2 = true;
  }

  socket.emit('servo', {command:0x03, micros: _micros});
  //console.log('_micros: ' + _micros);
  socket.emit('CAM.ch2', status.video.ch2);
})
