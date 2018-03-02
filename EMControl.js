var i2c = require('i2c');

var EMController = {};
exports.init = function(EMControllerAddr) {
  EMController.device = new i2c(EMControllerAddr, {device: '/dev/i2c-1'});
}

//variable attraction strength
exports.attract = function(strength) {
  EMController.device.writeBytes(0x05, [strength], function(err) {});
  console.log("attract: " + strength)
}
