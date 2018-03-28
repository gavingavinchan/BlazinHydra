const profile = require('./thrustProfilePong.js');

for(var y=-1.0; y<=1.0; y+=0.25){
  var line = "";
  for(var x=-1.0; x<=1.0; x+=0.25){
    line += profile.mappingH(x, y).HL.toFixed(2) + ',' + profile.mappingH(x,y).HR.toFixed(2) + ',';
  }
  console.log(line);
}
