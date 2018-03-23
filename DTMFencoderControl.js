var i2c = require('i2c');

var DTMFencoder = {};
exports.init = function(DTMFencoderAddr) {
  DTMFencoder.device = new i2c(DTMFencoderAddr, {device: '/dev/i2c-1'});
}

exports.tone = function(tone) {
  DTMFencoder.device.writeBytes(0x06, [tone], function(err) {});
  //console.log("DTMF playing: " + tone);
}
