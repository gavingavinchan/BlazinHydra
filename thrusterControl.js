var i2c = require('i2c');

var addrArray = [];
exports.init = function(_arr) {
  addrArray = _arr;
}

var HL = new i2c(addrArray[0], {device: '/dev/i2c-1'});
var HR = new i2c(addrArray[1], {device: '/dev/i2c-1'});
var VL = new i2c(addrArray[2], {device: '/dev/i2c-1'});
var VR = new i2c(addrArray[3], {device: '/dev/i2c-1'});

var thrustArr = [0,0,0,0];
//HL = 0, HR, 1, VL = 2, VR = 3

exports.thrust(addrIndex,value) {
  thrustArr.splice(addrIndex,1,value);
}

setInterval(function() {
  HL.writeBytes(0x00, [thrusterAddr[i] >> 8, ])
},20);
