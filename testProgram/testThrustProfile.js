const assert = require('assert');

var thrustProfile = require("../thrustProfile.js");

for(i=0;i<1;i+=0.01){
  assert.equal(i, thrustProfile.deadZone(i));
}

//var testValues = [-1,-0.95,-0.9,-0.8,-0.7,-0.6,-0.5,-0.4,-0.3,-0.2,-0.1,-0.05,0,0.05,0.1,0.2,0.3,0.4,0.5,0.6,0.7];

var dz = thrustProfile.
