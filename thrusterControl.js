var i2c = require('i2c');

var thrusters = [];

//HL = 0, HR, 1, VL = 2, VR = 3

var addrArray = [];
var _init = function(_addresses) {
  addrArray = _addresses;
  console.log("thrusterControl initiated");

  for(var i=0; i<_addresses.length; i++){
    var thruster = {
      device: new i2c(_addresses[i].address, {device: '/dev/i2c-1'}),
      currentSpeed: 0,
      targetSpeed: 0,
      maxAcceleration: 0.01,
    };
    thrusters[_addresses[i].name] = thruster;
  }
};

var loop;
var _startLoop = function() {
  thrusters["HL"].device.writeBytes(0x00, [0x00, 0x00], function(err) {});

  loop = setInterval(function() {
    thrusters["HL"].device.writeBytes(0x00, [thrusters["HL"].targetSpeed >>> 8, thrusters["HL"].targetSpeed%255], function(err) {});
  },20);
};

var _stopLoop = function() {
  clearInterval(loop);
  thrusters["HL"].device.writeBytes(0x00, [0x00, 0x00], function(err) {});
}

var _thrust = function(device,value) {
  value *= 32767;
  thrusters[device].targetSpeed = value;
  //thrustArr.splice(addrIndex,1,value);
  //console.log("thrustArr: " + thrustArr[addrIndex]);
  //console.log(thrustArr[addrIndex] >> 8);
  //console.log(thrustArr[addrIndex]%255);
};

module.exports = {
  init: _init,
  startLoop: _startLoop,
  stopLoop: _stopLoop,
  thrust: _thrust,
};
