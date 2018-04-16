var fineH = 0.4;
var coarseH = 0.8;
var fineV = 0.4;
var coarseV = 0.9;

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



var direction = 1;

exports.mappingH = function(x,y) {
  if (direction>0)
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

exports.mappingV = function(x,y) {
  return {
    VL: profileChainV(transform(deadZone(x),deadZone(y)).left),
    VR: profileChainV(transform(deadZone(x),deadZone(y)).right)
  };
};

//*****


exports.limiter = function(fineCoarse) {   //boolean; fine:true, coarse:false
  if(fineCoarse) {
    multiplierLimitH = fineH;
    multiplierLimitV = fineV;
  } else {
    multiplierLimitH = coarseH;
    multiplierLimitV = coarseV;
  }
}


//*****
exports.direction = function(_direction) {  //-1 or 1
  direction = _direction;
}
