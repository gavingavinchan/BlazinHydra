
var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();

var jLeft = {};
var jRight = {};

controller.on("left:move", function(value) {
  jLeft.x = value.x;
})

console.log(jLeft.x);

var os   = require('os'),
    clui = require('clui');

var Gauge = clui.Gauge;
var gaugeMAX = 1;
var gaugeWidth = 30;

var suffix = "leftX";

console.log(Gauge(jLeft.x, gaugeMAX, gaugeWidth, gaugeMAX, suffix));
