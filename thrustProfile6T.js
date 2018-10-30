var fineH = 0.45;
var coarseH = 0.95;
var fineV = 0.45;
var coarseV = 0.95;


var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000');


var state = {
  drive: 0,
  strafe: 0,
  rotate: 0,
  upDown: 0,
  tilt: 0,
  direction: 1,
  fineControlToggle: false
}


function transformH(drive,strafe,rotate) {
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


function transformV(x,y) {
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
function truncate(value) {
  if(value > 1) {
    value = 1;
  } else if(value < -1) {
    value = -1;
  }
  return value;
}


//*************************
var mappingH = function(drive, strafe, rotate) {
  if (state.direction>0)
    return {
      HFL: profileChainH(transformH(deadZone(drive),deadZone(strafe),deadZone(rotate)).HFL),
      HFR: profileChainH(transformH(deadZone(drive),deadZone(strafe),deadZone(rotate)).HFR),
      HRL: profileChainH(transformH(deadZone(drive),deadZone(strafe),deadZone(rotate)).HRL),
      HRR: profileChainH(transformH(deadZone(drive),deadZone(strafe),deadZone(rotate)).HRR),
    };
  else
    return {
      HFL: profileChainH(transformH(deadZone(-drive),deadZone(-strafe),deadZone(rotate)).HFL),
      HFR: profileChainH(transformH(deadZone(-drive),deadZone(-strafe),deadZone(rotate)).HFR),
      HRL: profileChainH(transformH(deadZone(-drive),deadZone(-strafe),deadZone(rotate)).HRL),
      HRR: profileChainH(transformH(deadZone(-drive),deadZone(-strafe),deadZone(rotate)).HRR),
    }
};


var mappingV = function(x,y) {
  return {
    VF: profileChainV(transformV(deadZone(x),deadZone(y)).left), //not left is now right
    VR: profileChainV(transformV(deadZone(x),deadZone(y)).right)
  };
};


//*************************
//is there a way to be this clumbersome
socket.on('drive', function(value) {
  state.drive = value;
  let mapped = mappingH(state.drive, state.strafe, state.rotate);

  socket.emit('thrusterControl.thrust.HFL', mapped.HFL);
  socket.emit('thrusterControl.thrust.HFR', mapped.HFR);
  socket.emit('thrusterControl.thrust.HRL', mapped.HRL);
  socket.emit('thrusterControl.thrust.HRR', mapped.HRR);
})

socket.on('strafe', function(value) {
  state.strafe = value;
  let mapped = mappingH(state.drive, state.strafe, state.rotate);

  socket.emit('thrusterControl.thrust.HFL', mapped.HFL);
  socket.emit('thrusterControl.thrust.HFR', mapped.HFR);
  socket.emit('thrusterControl.thrust.HRL', mapped.HRL);
  socket.emit('thrusterControl.thrust.HRR', mapped.HRR);
})

socket.on('rotate', function(value) {
  state.rotate = value;
  let mapped = mappingH(state.drive, state.strafe, state.rotate);

  socket.emit('thrusterControl.thrust.HFL', mapped.HFL);
  socket.emit('thrusterControl.thrust.HFR', mapped.HFR);
  socket.emit('thrusterControl.thrust.HRL', mapped.HRL);
  socket.emit('thrusterControl.thrust.HRR', mapped.HRR);
})



socket.on('upDown', function(value) {
  state.upDown = value;
  let mapped = mappingV(state.tilt, state.upDown);

  socket.emit('thrusterControl.thrust.VF', mapped.VF);
  socket.emit('thrusterControl.thrust.VR', mapped.VR);
})

socket.on('tilt', function(value) {
  state.tilt = value;
  let mapped = mappingV(state.tilt, state.upDown);

  socket.emit('thrusterControl.thrust.VF', mapped.VF);
  socket.emit('thrusterControl.thrust.VR', mapped.VR);
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
