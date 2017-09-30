var thrusterControl = require("../thrusterControl.js");

var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();

var leftX = 0;
controller.on("left:move", function(value) {
  leftX = value.x;
})

var addrArray = [0x30,0x31,0x32,0x33];
thrusterControl.init(addrArray);

function normalize(x) {
  return (x - 255/2)/(255/2);
}

var deadZoneRange = 0.05;
function deadZone(x) {
  if(Math.abs(x) < deadZoneRange) {
    return 0;
  } else {
    return x>0 ? (Math.abs(x)-deadZoneRange)/(1-deadZoneRange) : -(Math.abs(x)-deadZoneRange)/(1-deadZoneRange);
  }
}

setInterval(function() {
  thrusterControl.thrust(0,deadZone(normalize(leftX)));
},20);
