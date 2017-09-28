var i2c = require('i2c');

var thrustArr = [0,0,0,0];
//HL = 0, HR, 1, VL = 2, VR = 3

var addrArray = [];
exports.init = function(_arr) {
  addrArray = _arr;
  console.log("thrusterControl initiated");

  var HL = new i2c(addrArray[0], {device: '/dev/i2c-1'});
  var HR = new i2c(addrArray[1], {device: '/dev/i2c-1'});
  var VL = new i2c(addrArray[2], {device: '/dev/i2c-1'});
  var VR = new i2c(addrArray[3], {device: '/dev/i2c-1'});

  HL.writeBytes(0x00, [0x00, 0x00], function(err) {});

  setInterval(function() {
    HL.writeBytes(0x00, [thrustArr[0] >>> 8, thrustArr[0]%255], function(err) {});
    console.log("HL thrust: " + thrustArr[0]>>>8);
  },20);
};

exports.thrust = function(addrIndex,value) {
  value *= 32767;
  thrustArr.splice(addrIndex,1,value);
  console.log("thrustArr: " + thrustArr[addrIndex]);
  console.log(thrustArr[addrIndex] >> 8);
  console.log(thrustArr[addrIndex]%255);
};
