var fineH = 0.45;
var coarseH = 0.95;
var fineV = 0.45;
var coarseV = 0.95;


var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000');

//TODO change to state
var state = {
  drive: 0,
  strafe: 0,
  rotate: 0,
  up: 0,
  tilt: 0,
  direction: 1,
  fineControlToggle: false
}

function Htransform(drive,strafe,rotate) {
  var HFL,HFR,HRL,HRR;
  HFL = drive + strafe + rotate;
  HFR = drive - strafe - rotate;
  HRL = drive - strafe + rotate;
  HRR = drive + strafe - rotate;

  return {
    HFL: truncate(HFL),
    HFR: truncate(HFR),
    HRL: truncate(HRL),
    HRR: truncate(HRR)
  }
}


function truncate(value) {
  if(value > 1) {
    value = 1;
  } else if(value < -1) {
    value = -1;
  }
  return value;
}


function Vtransform(x,y) {
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
var mappingH = function(drive, strafe, rotate) {
  if (state.direction>0)
    return {
      HFL: profileChainH(Htransform(deadZone(drive),deadZone(strafe),deadZone(rotate)).HFL),
      HFR: profileChainH(Htransform(deadZone(drive),deadZone(strafe),deadZone(rotate)).HFR),
      HRL: profileChainH(Htransform(deadZone(drive),deadZone(strafe),deadZone(rotate)).HRL),
      HRR: profileChainH(Htransform(deadZone(drive),deadZone(strafe),deadZone(rotate)).HRR),
    };
  else
    return {
      HFL: -profileChainH(Htransform(deadZone(drive),deadZone(strafe),deadZone(rotate)).HFL),
      HFR: -profileChainH(Htransform(deadZone(drive),deadZone(strafe),deadZone(rotate)).HFR),
      HRL: -profileChainH(Htransform(deadZone(drive),deadZone(strafe),deadZone(rotate)).HRL),
      HRR: -profileChainH(Htransform(deadZone(drive),deadZone(strafe),deadZone(rotate)).HRR),
    }
};
/*
socket.on('gamepad.leftJoystick', function(value) {
  socket.emit('thrusterControl.thrust.HL', mappingH(value.x,value.y).HL);
  socket.emit('thrusterControl.thrust.HR', mappingH(value.x,value.y).HR);
})
*/

//is there a way to be this clumbersome
socket.on('drive', function(_drive) {
  state.drive = _drive;
  let mapped = mappingH(state.drive, state.strafe, state.rotate);
  
  socket.emit('thrusterControl.thrust.HFL', mapped.HFL);
  socket.emit('thrusterControl.thrust.HFR', mapped.HFR);
  socket.emit('thrusterControl.thrust.HRL', mapped.HRL);
  socket.emit('thrusterControl.thrust.HRR', mapped.HRR);
})

socket.on('strafe', function(_strafe) {
  state.strafe = _strafe;
  let mapped = mappingH(state.drive, state.strafe, state.rotate);

  socket.emit('thrusterControl.thrust.HFL', mapped.HFL);
  socket.emit('thrusterControl.thrust.HFR', mapped.HFR);
  socket.emit('thrusterControl.thrust.HRL', mapped.HRL);
  socket.emit('thrusterControl.thrust.HRR', mapped.HRR);
})

socket.on('rotate', function(_rotate) {
  state.rotate = _rotate;
  let mapped = mappingH(state.drive, state.strafe, state.rotate);

  socket.emit('thrusterControl.thrust.HFL', mapped.HFL);
  socket.emit('thrusterControl.thrust.HFR', mapped.HFR);
  socket.emit('thrusterControl.thrust.HRL', mapped.HRL);
  socket.emit('thrusterControl.thrust.HRR', mapped.HRR);
})



var mappingV = function(x,y) {
  return {
    VL: profileChainV(transform(deadZone(x),deadZone(y)).left),
    VR: profileChainV(transform(deadZone(x),deadZone(y)).right)
  };
};

socket.on('gamepad.rightJoystick', function(value) {
  socket.emit('thrusterControl.thrust.VF', mappingV(value.x,value.y).VL);
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
  state.direction = _direction;
});
