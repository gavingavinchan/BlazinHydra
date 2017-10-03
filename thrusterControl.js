var i2c = require('i2c');

var timeInterval = 20;
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
      maxAcceleration: 0.001,
    };
    thrusters[_addresses[i].name] = thruster;
  }
};

var loop;
var _startLoop = function() {
  thrusters["HL"].device.writeBytes(0x00, [0x00, 0x00], function(err) {});

  loop = setInterval(function() {
    //thrusters.forEach(function(element) {});
    let t = thrusters["HL"];
    var newSpeed = 0;
    if(Math.abs(t.targetSpeed-t.currentSpeed) > t.maxAcceleration) {
      if(t.targetSpeed > 0) {
        console.log("positive acceleration too high.   " + "currentSpeed: " + t.currentSpeed + " newSpeed: " + newSpeed);
        newSpeed = t.currentSpeed + t.maxAcceleration;
      } else {
        newSpeed = t.currentSpeed - t.maxAcceleration;
        console.log("negative acceleration too low.   " + "currentSpeed: " + t.currentSpeed + " newSpeed: " + newSpeed);
      }
    }
    console.log("value: " + newSpeed*32767);
    if(Math.abs(newSpeed) > 1) {
      if(newSpeed>0) {newSpeed = 1} else {newSpeed = -1};
    }

    t.device.writeBytes(0x00, [newSpeed*32767 >>> 8, (newSpeed*32767)%255], function(err) {});

    t.currentSpeed = newSpeed;
  },timeInterval);
};

var _stopLoop = function() {
  clearInterval(loop);
  thrusters["HL"].device.writeBytes(0x00, [0x00, 0x00], function(err) {});
}

var _thrust = function(id,value) {
  //value *= 32767;
  thrusters[id].targetSpeed = value;
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
