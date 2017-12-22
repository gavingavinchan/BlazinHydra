const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('heading: ', (_heading) => {
  initData.heading = _heading;

  rl.question('Ascent airspeed: ', (a_airspeed) => {
    a.airspeed = a_airspeed;

    rl.question('Ascent rate: ', (a_rate) => {
      a.rate = a_rate;

      rl.question('Ascent time: ', (a_time) => {
        a.time = a_time;

        rl.question('Descent airspeed: ', (d_airspeed) => {
          d.airspeed = d_airspeed;

          rl.question('Descent rate: ', (d_rate) => {
            d.rate = d_rate;

            rl.question('Wind speed: ', (w_speed) => {
              w.speed = w_speed;

              rl.question('Wind is blowing from: ', (w_from) => {
                w.from = w_from;

                //calculate vectors
                calc_a();
                calc_d();
                calc_w();
                calc_f();

                print();
                rl.close();
              });
            });
          });
        });
      });
    });
  });
});

var initData = {};

//ascent
var a = {};

//descent
var d = {};

//wind
var w = {};

//final location
var f = {};

/**
//for testing purposes
initData.heading = 184;
//a.airspeed = 93;
a.rate = 10;
a.time = 43;

//***********************
*/

function sinDegrees(angle) {
  return Math.sin(angle/180*Math.PI);
};

function cosDegrees(angle) {
  return Math.cos(angle/180*Math.PI);
};

function calcDisplacement(obj) {
  obj.displacement = Math.sqrt(Math.pow(obj.airspeed,2) - Math.pow(obj.rate,2)) * obj.time;
  //console.log(Math.pow(a.ascent,2));
}

//only for a or b
function vectorXY(obj, _heading) {
  obj.x = a.displacement*sinDegrees(_heading);
  obj.y = a.displacement*cosDegrees(_heading);
}

//calculate ascent
function calc_a() {
  a.height = a.rate*a.time;
  calcDisplacement(a);
  vectorXY(a, initData.heading);
}

function calc_d() {
  d.time = a.height/d.rate;
  calcDisplacement(d);
  vectorXY(d, initData.heading);
}

function calc_w() {
  w.displacement = w.speed*a.time + w.speed*d.time;
  //why does w.speed*(a.time + d.time) does not work?
  //console.log(a.time + d.time);

  //invert wind direction, "wind is blowing from" not wind direction
  if(w.from == 0){
  } else if(w.from < 180) {
    w.direction = w.from + 180;
  } else {
    w.direction = w.from - 180;
  }

  vectorXY(w, w.direction);
}

function calc_f() {
  f.x = a.x + d.x + w.x;
  f.y = a.y + d.y + w.y;

  f.displacement = Math.sqrt(Math.pow(f.x,2) + Math.pow(f.y,2));
  f.direction = Math.acos(f.y/f.displacement) /Math.PI*180;
  console.log("f.x/f.displacement: " + f.x/f.displacement *Math.PI/180);
}

function print() {
  console.log("***********************RESULTS***********************");
  console.log("f.x: " + f.x + "  f.y: " + f.y);
  console.log("Ascent Vector: " + a.displacement + "m at " + initData.heading);
  console.log("Descent Vector: " + d.displacement + "m at " + initData.heading);
  console.log("Wind Vector: " + w.displacement + "m at " + w.direction);

  console.log("Final Vector: " + f.displacement + "m at " + f.direction);
}
