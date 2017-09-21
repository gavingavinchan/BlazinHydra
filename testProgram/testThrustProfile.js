const assert = require('assert');

var thrustProfile = require("../thrustProfile.js");

for(i=0;i<1;i+=0.01){
  assert.equal(i, thrustProfile.deadZone(i));
}
