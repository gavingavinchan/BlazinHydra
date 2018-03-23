var i2c = require('i2c');

/*
var EMController = {};
exports.init = function(EMControllerAddr) {
  EMController.device = new i2c(EMControllerAddr, {device: '/dev/i2c-1'});
}
*/
module.exports = function(addr){
  var EM = function(){};
  var i2cdevice = new i2c(addr, {device: '/dev/i2c-1'});

  //variable attraction strength
  EM.attract = function(strength) {
    i2cdevice.writeBytes(0x05, [strength], function(err) {
      console.error(err);
    });
  }

  return EM;
}
