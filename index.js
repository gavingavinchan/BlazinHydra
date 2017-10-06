var addrArray = [
  {name:"HL", address: 0x32},
  {name:"HR", address: 0x31},
  {name:"VL", address: 0x30},
  {name:"VR", address: 0x33},
];


//Initiation
var thrusterControl = require("./thrusterControl.js");
var thrustProfile = require("./thrustProfile.js");

var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();

thrusterControl.init(addrArray);
thrusterControl.startLoop();

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
  }
};

function normalize(x) {
  return (x - 255/2)/(255/2);
}

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
