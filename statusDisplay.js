var index = require("./index.js");


var status = {};

var CLI         = require('clui'),
    clc         = require('cli-color'),
    Line        = CLI.Line,
    LineBuffer  = CLI.LineBuffer,
    clear       = CLI.Clear,
    Gauge       = CLI.Gauge;

var gaugeArr = [];
var drawTimeout;

function draw() {
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

  var gaugeWidth = 30;

  var line = new Line(outputBuffer)
    .column("LeftX",13)
    .column(Gauge(status.gamepad.leftX + 1, 2, 40, 2, status.gamepad.leftX.toFixed(3)),80)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("LeftY",13)
    .column(Gauge(status.gamepad.leftY + 1, 2, 40, 2, status.gamepad.leftY.toFixed(3)),80)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("RightX",13)
    .column(Gauge(status.gamepad.rightX + 1, 2, 40, 2, status.gamepad.rightX.toFixed(3)),80)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("RightY",13)
    .column(Gauge(status.gamepad.rightY + 1, 2, 40, 2, status.gamepad.rightY.toFixed(3)),80)
    .fill()
    .store();


  var blankLine = new Line(outputBuffer)
    .fill()
    .store();

  var blankLine = new Line(outputBuffer)
    .fill()
    .store();


  var line = new Line(outputBuffer)
    .column("Thruster HL: ",13)
    .column(Gauge(status.thrust.HL + 1, 2, 40, 2, status.thrust.HL.toFixed(3)),60)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("Thruster HR: ",13)
    .column(Gauge(status.thrust.HR + 1, 2, 40, 2, status.thrust.HR.toFixed(3)),60)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("Thruster VL: ",13)
    .column(Gauge(status.thrust.VL + 1, 2, 40, 2, status.thrust.VL.toFixed(3)),60)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("Thruster VR: ",13)
    .column(Gauge(status.thrust.VR + 1, 2, 40, 2, status.thrust.VR.toFixed(3)),60)
    .fill()
    .store();


  var blankLine = new Line(outputBuffer)
    .fill()
    .store();


    var depth = status.depth.cm;

// TODO: Make sure the depth is within range before drawing

  var depthValue = (status.depth.cm - status.depth.zero).toFixed(1);

  if(depth<0) {depth=0;}

  var depthGaugeRange = 200;
  if(depth>depthGaugeRange) {depth=depthGaugeRange;}


  var line = new Line(outputBuffer)
    .column("Depth: ",13)
    .column(status.depth.cm.toFixed(1).toString(),50)
    .fill()
    .store();


  var line = new Line(outputBuffer)
    .column("Direction: ",11)
    .column(status.gamepad.direction == 1? "Front" : "Rear",50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("fineCoarse: ",12)
    .column(status.thrust.fineCoarse? "Fine" : "Coarse",50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("Video Channel 1: ",17)
    .column(status.video.ch1? "CAM 1" : "CAM 2",50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("Video Channel 2: ",17)
    .column(status.video.ch2? "CAM 3" : "CAM 4",50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("EM 1: ", 6)
    .column(status.manipulator.EM1? "ON" : "OFF",50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("EM 2: ", 6)
    .column(status.manipulator.EM2? "ON" : "OFF",50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("DTMFencoder: ", 13)
    .column(status.manipulator.DTMFencoder? "Playing Pin" : "OFF",50)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("Height (cm): ", 15)
    .column(status.depth.cmTared.toFixed(1).toString(),50)
    .fill()
    .store();


    var blankLine = new Line(outputBuffer)
      .fill()
      .store();


  var line = new Line(outputBuffer)
    .column("Message: ", 15)
    .column(status.message.toString(),50)
    .fill()
    .store();

  clear();
  outputBuffer.output();
}


//***********
exports.init = function() {
  setInterval(function() {
    status = index.getStatus();
    draw();
  },50);
}
