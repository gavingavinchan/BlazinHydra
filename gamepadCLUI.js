
var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();

var status = {
  gamepad: {
    leftX: 0,
    leftY: 0,
    XButton: false,
  },
};


controller.on("left:move", function(value) {
  status.gamepad.leftX = value.x;
  status.gamepad.leftY = value.y;
})

controller.on("right:move", function(value) {
  status.gamepad.rightX = value.x;
  status.gamepad.rightY = value.y;
})

controller.on("x:press", function(){
  status.gamepad.XButton = true;
})
controller.on("x:release", function() {
  status.gamepad.XButton = false;
})


var CLI         = require('clui'),
    clc         = require('cli-color'),
    Line        = CLI.Line,
    LineBuffer  = CLI.LineBuffer,
    clear       = CLI.Clear,
    Gauge       = CLI.Gauge;

var drawTimeout;

function draw() {
  clear();

  var outputBuffer = new LineBuffer({
    x: 0,
    y: 0,
    width: 80,
    height: 40
  });

  var outputBuffer = new LineBuffer({
    x: 0,
    y: 0,
    width: 'console',
    height: 'console'
  });

  var gaugeWidth = 40;

  var line = new Line(outputBuffer)
    .column("LeftX",10)
    .column(Gauge(status.gamepad.leftX, 255, 40, 255, status.gamepad.leftX),50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("LeftY",10)
    .column(Gauge(status.gamepad.leftY, 255, 40, 255, status.gamepad.leftY),50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("RightX",10)
    .column(Gauge(status.gamepad.rightX, 255, 40, 255, status.gamepad.rightX),50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("RightY",10)
    .column(Gauge(status.gamepad.rightY, 255, 40, 255, status.gamepad.rightY),50)
    .fill()
    .store();


  var Xstatus;
  if(status.gamepad.XButton == true) {
    Xstatus = "ON";
  } else {
    Xstatus = "OFF";
  }
  var line = new Line(outputBuffer)
    .column("X",10)
    .column(Xstatus,50)
    .fill()
    .store();

  var blankLine = new Line(outputBuffer)
    .fill()
    .store();

  var blankLine = new Line(outputBuffer)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("normalize(LeftX)",20)
    .column(Gauge(normalize(status.gamepad.leftX)+1, 2, 40, 2, normalize(status.gamepad.leftX)),80)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("deadZone(normalize(LeftX))",20)
    .column(Gauge(deadZone(normalize(status.gamepad.leftX))+1, 2, 40, 2, deadZone(normalize(status.gamepad.leftX))+1),80)
    .fill()
    .store();


  outputBuffer.output();
  drawTimeout = setTimeout(draw, 1000);
}

setInterval(function() {
  draw();
},100);

function normalize(x) {
  return (x - 255/2)/(255/2);
}

var deadZoneRange = 0.1;
function deadZone(x) {
  if(-deadZoneRange<x && x<deadZoneRange) {
    return 0;
  } else {
    return (Math.abs(x)-deadZoneRange)/(1-deadZoneRange) * (x/Math.abs(x));
  }
}
