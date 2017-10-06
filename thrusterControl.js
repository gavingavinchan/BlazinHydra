var i2c = require('i2c');

const timeInterval = 20;
const maxAccelerationPerSecond = 0.5;

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
      maxAcceleration: maxAccelerationPerSecond / timeInterval,
    };
    thrusters[_addresses[i].name] = thruster;
  }
};

var loop;
var _startLoop = function() {
  for(var t in thrusters) {
    thrusters[t].device.writeBytes(0x00, [0x00, 0x00], err => {});
  }

  //thrusters["HL"].device.writeBytes(0x00, [0x00, 0x00], function(err) {});

  loop = setInterval(function() {
    for(var t in thrusters) {
      //let t = element;
      t = thrusters[t];
      //console.log(t.maxAcceleration);
      if(Math.abs(t.targetSpeed-t.currentSpeed) > t.maxAcceleration) {
        if(t.targetSpeed > t.currentSpeed) {
          //console.log("positive acceleration too high.   " + "currentSpeed: " + t.currentSpeed + " newSpeed: " + newSpeed);
          t.currentSpeed += t.maxAcceleration;
        } else {
          t.currentSpeed -= t.maxAcceleration;
          //console.log("negative acceleration too low.   " + "currentSpeed: " + t.currentSpeed);
        }
      } else {
        t.currentSpeed = t.targetSpeed;
      }
      //console.log("value: " + t.currentSpeed*32767);

      // truncate
      if(Math.abs(t.currentSpeed) > 1) {
        if(t.currentSpeed>0) {t.currentSpeed = 1} else {t.currentSpeed = -1};
      }

      t.device.writeBytes(0x00, [t.currentSpeed*32767 >>> 8, (t.currentSpeed*32767)%255], function(err) {});
    }
  },timeInterval);
};

var _stopLoop = function() {
  clearInterval(loop);
  for(var t in thrusters) {
    thrusters[t].device.writeBytes(0x00, [0x00, 0x00], err => {});
  }
}

var _thrust = function(id,value) {
  thrusters[id].targetSpeed = value;
};

module.exports = {
  init: _init,
  startLoop: _startLoop,
  stopLoop: _stopLoop,
  thrust: _thrust,
};
