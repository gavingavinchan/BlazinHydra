var fineH = 0.45;
var coarseH = 0.95;
var fineV = 0.45;
var coarseV = 0.95;


var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000');


var status = {
  gamepad: {
    direction: 1,
    fineControlToggle: false
  }
}

function transform(x,y) {
  var left,right;
  if(x==0 || y==0) {
    left = x+y;
    right= -x+y;
  } else {
    var a = Math.max(Math.abs(x),Math.abs(y));
    var xx,yy;
    if(x>0) {
      xx = a/(1 + Math.abs(y)/Math.abs(x));
    } else {
      xx = -a/(1 + Math.abs(y)/Math.abs(x));
    }
    if(y>0) {
      yy = a/(1 + Math.abs(x)/Math.abs(y));
    } else {
      yy = -a/(1 + Math.abs(x)/Math.abs(y));
    }
    left = xx+yy;
    right = -xx+yy;
  }
  return {
    left: left,
    right: right
  };
}



//*************************
function profileChainH(x) {
  return multiplierH(curveH(x));
}

function profileChainV(x) {
  return multiplierV(curveV(x));
}

//*************************
var deadZoneRange = 0.05;
function deadZone(x) {
  if(Math.abs(x) < deadZoneRange) {
    return 0;
  } else {
    return x>0 ? (Math.abs(x)-deadZoneRange)/(1-deadZoneRange) : -(Math.abs(x)-deadZoneRange)/(1-deadZoneRange);
  }
}

//*************************
var curvePowH = 1;
function curveH(x) {
  return x>0 ? Math.pow(x,curvePowH) : -Math.abs(Math.pow(x,curvePowH));
}

var curvePowV = 1;
function curveV(x) {
  return x>0 ? Math.pow(x,curvePowV) : -Math.abs(Math.pow(x,curvePowV));
}

//*************************
var multiplierLimitH = coarseH;
function multiplierH(x) {
  return x*multiplierLimitH;
}

var multiplierLimitV = coarseV;
function multiplierV(x) {
  return x*multiplierLimitV;
}

//*************************





var mappingH = function(x,y) {
  if (status.gamepad.direction>0)
    return {
      HL: profileChainH(transform(deadZone(x),deadZone(y)).left),
      HR: profileChainH(transform(deadZone(x),deadZone(y)).right)
    };
  else
    return {
      HR: -profileChainH(transform(deadZone(x),deadZone(y)).left),
      HL: -profileChainH(transform(deadZone(x),deadZone(y)).right)
    }
};

socket.on('gamepad.leftJoystick', function(value) {
  socket.emit('thrusterControl.thrust.HL', mappingH(value.x,value.y).HL);
  socket.emit('thrusterControl.thrust.HR', mappingH(value.x,value.y).HR);
})


var mappingV = function(x,y) {
  return {
    VL: profileChainV(transform(deadZone(x),deadZone(y)).left),
    VR: profileChainV(transform(deadZone(x),deadZone(y)).right)
  };
};

socket.on('gamepad.rightJoystick', function(value) {
  socket.emit('thrusterControl.thrust.VL', mappingV(value.x,value.y).VL);
  socket.emit('thrusterControl.thrust.VR', mappingV(value.x,value.y).VR);
})

//*****
var limiter = function(fineCoarse) {   //boolean; fine:true, coarse:false
  if(fineCoarse) {
    multiplierLimitH = fineH;
    multiplierLimitV = fineV;
  } else {
    multiplierLimitH = coarseH;
    multiplierLimitV = coarseV;
  }
}

socket.on('profile.fineCoarse', function(_fineCoarse) {
  limiter(_fineCoarse);
})


//*****
socket.on('profile.direction', function(_direction) {
  status.gamepad.direction = _direction;
});

/*
exports.direction = function(_direction) {  //-1 or 1
  direction = _direction;
}*/
