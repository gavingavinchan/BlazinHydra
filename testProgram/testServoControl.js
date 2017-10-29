var servoControl = require("../servoControl.js");

var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();

servoControl.init(0x16);

var channel = true;
controller.on("dpadUp:press", function() {
  console.log("pressed");
  if(channel) {
    servoControl.servo(0x02,1100);
    console.log("true");
    channel = false;
  } else {
    servoControl.servo(0x02,1500);
    channel = true;
  }
})
