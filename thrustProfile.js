


function profileChainH(x) {
  //return deadZone(x);
  return fineControlH(curveH(deadZone(x)));
}

function profileChainV(x) {
  return fineControlV(curveV(deadZone(x)));
}

var deadZoneRange = 0.05;
function deadZone(x) {
  if(Math.abs(x) < deadZoneRange) {
    return 0;
  } else {
    return x>0 ? (Math.abs(x)-deadZoneRange)/(1-deadZoneRange) : -(Math.abs(x)-deadZoneRange)/(1-deadZoneRange);
  }
}



var curvePowH = 2;
function curveH(x) {
  return x>0 ? Math.pow(x,curvePowH) : -Math.pow(x,curvePowH);
}

var curvePowV = 2;
function curveV(x) {
  return x>0 ? Math.pow(x,curvePowV) : -Math.pow(x,curvePowV);
}



var fineControlLimitH = 0.3;
function fineControlH(x) {
  return x*fineControlLimitH;
}

var fineControlLimitV = 0.3;
function fineControlV(x) {
  return x*fineControlLimitV;
}

var adjusted = {
  H: {
    x: 0,
    y: 0,
  },
  V: {
    x: 0,
    y: 0,
  }
}
exports.mappingH(x,y) {

}

console.log(profileChainH(1));
console.log(profileChainV(1));
