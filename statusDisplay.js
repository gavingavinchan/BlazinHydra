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

  var gaugeWidth = 30;

  var line = new Line(outputBuffer)
    .column("LeftX",10)
    .column(Gauge(status.gamepad.leftX + 1, 2, 40, 2, status.gamepad.leftX.toFixed(3)),60)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("LeftY",10)
    .column(Gauge(status.gamepad.leftY + 1, 2, 40, 2, status.gamepad.leftY.toFixed(3)),60)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("RightX",10)
    .column(Gauge(status.gamepad.rightX + 1, 2, 40, 2, status.gamepad.rightX.toFixed(3)),60)
    .fill()
    .store();

  var line = new Line(outputBuffer)
    .column("RightY",10)
    .column(Gauge(status.gamepad.rightY + 1, 2, 40, 2, status.gamepad.rightY.toFixed(3)),60)
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


  var ch1;
  if(status.video.ch1 == true) {
    ch1 = "CAM 1";
  } else {
    ch1 = "CAM 2";
  }
  var line = new Line(outputBuffer)
    .column("Video Channel 1: ",17)
    .column(ch1,50)
    .fill()
    .store();

  var ch2;
  if(status.video.ch2 == true) {
    ch2 = "CAM 3";
  } else {
    ch2 = "CAM 4"
  }
  var line = new Line(outputBuffer)
    .column("Video Channel 2: ",17)
    .column(ch2,50)
    .fill()
    .store();

  outputBuffer.output();
}

exports.init = function() {
  setInterval(function() {
    status = index.getStatus();
    draw();
  },50);
}
