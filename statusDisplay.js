//getStatus()

var CLI         = require('clui'),
    clc         = require('cli-color'),
    Line        = CLI.Line,
    LineBuffer  = CLI.LineBuffer,
    clear       = CLI.Clear,
    Gauge       = CLI.Gauge;

var gaugeArr = [];



exports.gauge = function(lable,x) {
  gaugeArr.push(lable,x);
}

exports.string = function(a,b) {

}


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

  for(var i=0;i<gaugeArr; i += 2) {
    var line = new Line(outputBuffer)
      .column(gaugeArr[i],10)
      .column(Gauge(gaugeArr[i+1], 255, 40, 255, gaugeArr[i+1]),50)
      .fill()
      .store();
  }

  outputBuffer.output();
}

setInterval(function() {
  draw();
},50);
