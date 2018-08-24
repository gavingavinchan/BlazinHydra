//TODO: give name to objects and then pubsub
var i2c = require('i2c');

var io = require('socket.io-client');

/*
var EMController = {};
exports.init = function(EMControllerAddr) {
  EMController.device = new i2c(EMControllerAddr, {device: '/dev/i2c-1'});
}
*/
module.exports = function(_settings){
  var EM = function() {};

  EM.setting = Object.assign({name: 'undefined', address: 0x00, }, _settings);
  EM.socket = io.connect('http://localhost:5000');

  const i2cdevice = new i2c(EM.setting.address, {device: '/dev/i2c-1'});

  //variable attraction strength
  EM.attract = function(strength) {
    i2cdevice.writeBytes(0x05, [strength], function(err) {
      console.error(err);
    });
  }

  EM.socket.on(EM.setting.name, function(value) {
    EM.attract(value.strength);
  })

  return EM;
}
