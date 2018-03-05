var addrArray = [
  {name:"HL", address: 0x3f, invert: true},
  {name:"HR", address: 0x30, invert: false},
  {name:"VL", address: 0x32, invert: true},
  {name:"VR", address: 0x33, invert: true},
];


//Initiation
var thrusterControl = require("./thrusterControl.js");
var thrustProfile = require("./thrustProfile.js");

var servoControl = require("./servoControl.js");

var EMControl = require("./EMControl.js");

var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");

var statusDisplay = require("./statusDisplay.js");
controller.connect();

thrusterControl.init(addrArray);
thrusterControl.startLoop();

servoControl.init(0x17);
EMControl.init(0x16);

//why was the statusDisplay disabled during the first water trial?
//statusDisplay.init();

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
    VR: 0
  },
  manipulator: {
    EM: false,
  },
  video: {
    ch1: true,
    ch2: false
  }
};

exports.getStatus = function() {
  return status;
}

function normalize(x) {
  return (x - 255/2)/(255/2);
}

//joystick
controller.on("left:move", function(value) {
  let gp = status.gamepad;
  gp.leftX = normalize(value.x);
  gp.leftY = normalize(value.y);

  status.thrust.HL = thrustProfile.mappingH(gp.leftX,gp.leftY).HL;
  status.thrust.HR = thrustProfile.mappingH(gp.leftX,gp.leftY).HR;

  thrusterControl.thrust("HL",status.thrust.HL);
  thrusterControl.thrust("HR",status.thrust.HR);
})

controller.on("right:move", function(value) {
  let gp = status.gamepad;
  gp.rightX = normalize(value.x);
  gp.rightY = normalize(value.y);

  status.thrust.VL = thrustProfile.mappingV(gp.rightX,gp.rightY).VL;
  status.thrust.VR = thrustProfile.mappingV(gp.rightX,gp.rightY).VR;

  thrusterControl.thrust("VL",status.thrust.VL);
  thrusterControl.thrust("VR",status.thrust.VR);
})

//Camera switching functionality
controller.on("dpadUp:press", function() {
  console.log("pressed");
  if(status.video.ch1) {
    servoControl.servo(0x02,1500);
    console.log("true");
    status.video.ch1 = false;
  } else {
    servoControl.servo(0x02,1100);
    status.video.ch1 = true;
  }
})

controller.on("dpadLeft:press", function() {
  if(status.video.ch2) {
    servoControl.servo(0x03,1500);
    status.video.ch2 = false;
  } else {
    servoControl.servo(0x03,1100);
    status.video.ch2 = true;
  }
})

//electromagnet
controller.on("l1:press", function(){
  if(status.manipulator.EM) {
    EMControl.attract(0);
    status.manipulator.EM = false;
    console.log("EM off");
  } else {
    EMControl.attract(255);
    status.manipulator.EM = true;
    console.log("EM on");
  }
})
