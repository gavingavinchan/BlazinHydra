var i2c = require('i2c');

var CAMController = {};
exports.init = function(CAMControllerAddr) {
  CAMController.device = new i2c(CAMControllerAddr, {device: '/dev/i2c-1'});
}

exports.servo = function(command,servoMicros) {
  CAMController.device.writeBytes(command, [servoMicros >>> 8, servoMicros%255], function(err) {});
}
