
var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();

var status = {
  gamepad: {
    leftX: 0,
    leftY: 0,
    rightX: 0,
    rightY: 0,
    XButton: false,
    fineControlToggle: false
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
  if(status.gamepad.fineControlToggle) {
    status.gamepad.fineControlToggle = false;
  } else {
    status.gamepad.fineControlToggle = true;
  }
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
    .column("normalize: ",20)
    .column(Gauge(normalize(status.gamepad.leftX)+1, 2, 40, 2, normalize(status.gamepad.leftX).toFixed(3)),80)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("deadZone: ",20)
    .column(Gauge(deadZone(normalize(status.gamepad.leftX))+1, 2, 40, 2, deadZone(normalize(status.gamepad.leftX)).toFixed(3)),80)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("curve: ",20)
    .column(Gauge(curve(deadZone(normalize(status.gamepad.leftX)))+1, 2, 40, 2, curve(deadZone(normalize(status.gamepad.leftX))).toFixed(3)),80)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("fineControl",20)
    .column(Gauge(fineControl(curve(deadZone(normalize(status.gamepad.leftX))))+1, 2, 40, 2, fineControl(curve(deadZone(normalize(status.gamepad.leftX)))).toFixed(3)),80)
    .fill()
    .store();

  if(status.gamepad.fineControlToggle) {
    var line = new Line(outputBuffer)
      .column("fineControl",20)
      .column(Gauge(fineControl(curve(deadZone(normalize(status.gamepad.leftX))))+1, 2, 40, 2, fineControl(curve(deadZone(normalize(status.gamepad.leftX)))).toFixed(3)),80)
      .fill()
      .store();
  } else {
    var line = new Line(outputBuffer)
      .column("curve: ",20)
      .column(Gauge(curve(deadZone(normalize(status.gamepad.leftX)))+1, 2, 40, 2, curve(deadZone(normalize(status.gamepad.leftX))).toFixed(3)),80)
      .fill()
      .store();
  }


  outputBuffer.output();
}

setInterval(function() {
  draw();
},50);

function normalize(x) {
  return (x - 255/2)/(255/2);
}

var deadZoneRange = 0.05;
function deadZone(x) {
  if(Math.abs(x) < deadZoneRange) {
    return 0;
  } else {
    return x>0 ? (Math.abs(x)-deadZoneRange)/(1-deadZoneRange) : -(Math.abs(x)-deadZoneRange)/(1-deadZoneRange);
  }
}

var curvePow = 2;
function curve(x) {
  return x>0 ? Math.pow(x,curvePow) : -Math.pow(x,curvePow);
}

var fineControlLimit= 0.3;
function fineControl(x) {
  return x*fineControlLimit;
}
