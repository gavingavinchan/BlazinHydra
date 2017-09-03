
var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();

var status = {
  gamepad: {
    leftX: 0,
    leftY: 0,
  },
};


controller.on("left:move", function(value) {
  status.gamepad.leftX = value.x;
})

var CLI        = require('clui'),
    clc         = require('cli-color'),
    Line        = CLI.Line,
    LineBuffer  = CLI.LineBuffer,
    clear = CLI.Clear,
    Gauge = CLI.Gauge;

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
    .column("LeftX",20)
    .column(Gauge(status.gamepad.leftX, 255, 40, 255, status.gamepad.leftX),50)
    .fill()
    .store();

  outputBuffer.output();
  drawTimeout = setTimeout(draw, 1000);
}

setInterval(function() {
  draw();
},100);
