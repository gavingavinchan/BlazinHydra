var thrusterControl = require("../thrusterControl.js");

var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();


var addrArray = [
  {name:"HL", address: 0x3F},
  {name:"HR", address: 0x33},
  {name:"VL", address: 0x32},
  {name:"VR", address: 0x31},
];
thrusterControl.init(addrArray);

thrusterControl.startLoop();

/*
setTimeout(function() {
  thrusterControl.stopLoop();
},5000);
*/

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

controller.on("left:move", function(value) {
  //leftX = value.x;
  thrusterControl.thrust("HL",deadZone(normalize(value.x)));
  thrusterControl.thrust("HR",deadZone(normalize(value.y)));
})
