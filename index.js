var thrusterAddr = [0,0,0,0];
//HL = 0, HR, 1, VL = 2, VR = 3

//Initiation
var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();

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

setInterval( function() {
  //status.thrust.HL = thrustProfile.mappingH.HL;
  //thrusterControl.thrust(thrusterAddr[0],status.thrust.HL);
  console.log(status.gamepad.leftX);
}, 60);

controller.on("left:move", function(value) {
  status.gamepad.leftX = value.x;
  status.gamepad.leftY = value.y;
})
