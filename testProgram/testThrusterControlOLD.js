var thrusterControl = require("../thrusterControlOLD.js");

var addrArray = [0x30,0x31,0x32,0x33];
thrusterControl.init(addrArray);

thrusterControl.thrust(0,0.5);

setTimeout(function() {
  thrusterControl.thrust(0,0);
},1000);
