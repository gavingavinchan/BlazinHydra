var i2c = require('i2c');

const timeInterval = 20;
const maxAccelerationPerSecond = 0.6;

var i2cThrusterWrite = function(device, _currentSpeed) {
  device.writeBytes(0x00, [_currentSpeed*32767 >>> 8, (_currentSpeed*32767)%255], function(err) {});
}

module.exports = function(setting){
  thruster = function() {};

  // INIT Thruster
  const s = Object.assign({ invert: false }, setting);
  const device = new i2c(s.address, {device: '/dev/i2c-1'});
  var currentSpeed = 0,
    targetSpeed= 0,
    invert= s.invert ? -1 : 1,
    maxStepPerInterval = maxAccelerationPerSecond * (timeInterval/1000);

  var loop = 0;

  thruster.start = function(){
    i2cThrusterWrite(device,0);
    loop = setInterval(() => {
      if(Math.abs(targetSpeed-currentSpeed) > maxStepPerInterval) {
        if(targetSpeed > currentSpeed) {
          //console.log("positive acceleration too high.   " + "currentSpeed: " + t.currentSpeed + " newSpeed: " + newSpeed);
          currentSpeed += maxStepPerInterval;
        } else {
          currentSpeed -= maxStepPerInterval;
          //console.log("negative acceleration too low.   " + "currentSpeed: " + t.currentSpeed);
        }
      } else {
        currentSpeed = targetSpeed;
      }
      // console.log("cs: " + currentSpeed);

      // truncate
      if(Math.abs(currentSpeed) > 1) {
        if(currentSpeed>0) {currentSpeed = 1} else {currentSpeed = -1};
      }

      i2cThrusterWrite(device, invert * currentSpeed);
    }, timeInterval);
  }

  thruster.stop = function(){
    i2cThrusterWrite(device, 0);
    clearInterval(loop);
  }

  thruster.thrust = function(power){
    targetSpeed = power;
  }

  return thruster;
};
