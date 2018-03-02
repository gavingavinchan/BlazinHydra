var i2c = require('i2c');

const timeInterval = 20;
const maxAccelerationPerSecond = 0.7;

var thrusters = [];
//HL = 0, HR, 1, VL = 2, VR = 3

var _init = function(settings) {

  console.log("thrusterControl initiated");

  settings.forEach(setting => {
    const s = Object.assign({ invert: false }, setting);
    //console.log(setting);
    var thruster = {
      device: new i2c(s.address, {device: '/dev/i2c-1'}),
      currentSpeed: 0,
      targetSpeed: 0,
      invert: s.invert ? -1 : 1,
      maxAcceleration: maxAccelerationPerSecond / timeInterval,
    };
    thrusters[s.name] = thruster;
  });
};

var i2cThrusterWrite = function(device, _currentSpeed) {
  device.writeBytes(0x00, [_currentSpeed*32767 >>> 8, (_currentSpeed*32767)%255], function(err) {});
}

var loop;
var _startLoop = function() {
  for(var t in thrusters) {
    i2cThrusterWrite(thrusters[t].device,0);
    //thrusters[t].device.writeBytes(0x00, [0x00, 0x00], err => {});
  }

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
      i2cThrusterWrite(t.device, t.currentSpeed*t.invert);
      //t.device.writeBytes(0x00, [t.currentSpeed*32767 >>> 8, (t.currentSpeed*32767)%255], function(err) {});
    }
  },timeInterval);
};

var _stopLoop = function() {
  clearInterval(loop);
  for(var t in thrusters) {
    i2cThrusterWrite(thrusters[t].device, 0);
    //thrusters[t].device.writeBytes(0x00, [0x00, 0x00], err => {});
  }
}

var _thrust = function(name,value) {
  thrusters[name].targetSpeed = value;
};

module.exports = {
  init: _init,
  startLoop: _startLoop,
  stopLoop: _stopLoop,
  thrust: _thrust,
};
