function profileChainH(x) {
  return fineControlH(curveH(deadZone(x)));
}

function profileChainV(x) {
  return fineControlV(curveV(deadZone(x)));
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
var curvePowH = 2;
function curveH(x) {
  return x>0 ? Math.pow(x,curvePowH) : -Math.pow(x,curvePowH);
}

var curvePowV = 2;
function curveV(x) {
  return x>0 ? Math.pow(x,curvePowV) : -Math.pow(x,curvePowV);
}

//*************************
var fineControlLimitH = 0.3;
function fineControlH(x) {
  return x*fineControlLimitH;
}

var fineControlLimitV = 0.3;
function fineControlV(x) {
  return x*fineControlLimitV;
}

//*************************
var thrust = {
  HL: 0,
  HR: 0,
  VL: 0,
  VR: 0,
}

exports.mappingH = function(x,y) {
  thrust.HL = profileChainH(x) + profileChainH(y);
  thrust.HR = -profileChainH(x) + profileChainH(y);

  return {
    HL: thrust.HL,
    HR: thrust.HR
  };
};
exports.deadZone = deadZone;
