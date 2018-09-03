var i2c = require('i2c');
var io = require('socket.io-client');


const timeInterval = 200;
const maxAccelerationPerSecond = 0.6;


var i2cThrusterWrite = function(device, _currentSpeed) {
  device.writeBytes(0x00, [_currentSpeed*32767 >>> 8, (_currentSpeed*32767)%255], function(err) {});
}

module.exports = function(setting){

  var thruster = function() {};

  // INIT Thruster
  thruster.setting = Object.assign({ name: 'undefined', address: 0x00, invert: false }, setting);
  thruster.socket = io.connect('http://localhost:5000');
  thruster.started = false;

  const device = new i2c(thruster.setting.address, {device: '/dev/i2c-1'});
  //console.log(thruster.setting);
  var currentSpeed = 0,
    targetSpeed= 0,
    invert= thruster.setting.invert ? -1 : 1,
    maxStepPerInterval = maxAccelerationPerSecond * (timeInterval/1000);

  var loop = 0;

  thruster.start = function(){
    if(thruster.started) return;
    thruster.started = true;

    //console.log(thruster.setting.name);
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

      thruster.socket.emit('thruster.thrust.'+ thruster.setting.name, currentSpeed);
      i2cThrusterWrite(device, invert * currentSpeed);
    }, timeInterval);
  }

  thruster.socket.on('thrusterControl.start', function() {
    thruster.start();
    thruster.socket.emit('thruster', thruster.setting.name + ': starting thruster');
  });



  thruster.stop = function(){
    i2cThrusterWrite(device, 0);
    clearInterval(loop);
  }

  thruster.socket.on('thrusterControl.stop', function() {
    thruster.stop();
  })



  thruster.thrust = function(power){
    targetSpeed = power;
  }

  thruster.socket.on('thrusterControl.thrust.'+ thruster.setting.name, function(power) {
    thruster.thrust(power);
  });

  return thruster;
};
