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

              rl.question('Wind direction: ', (w_direction) => {
                w.direction = w_direction;

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

var initData = {
  location: 0,
  heading: 0
};

//ascent
var a = {
  airspeed: 0,
  rate: 0,
  time: 0,
  height: 0,
  displacement: 0
};

//descent
var d = {
  airspeed: 0,
  rate: 0,
  time: 0,
  displacement: 0
}

//wind
var w = {
  speed: 0,
  direction: 0,
  displacement: 0
}

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

function calcDisplacement(obj) {
  var obj2 = obj;
  obj.displacement = Math.sqrt(Math.pow(obj.airspeed,2) - Math.pow(obj.rate,2)) * obj.time;
  //console.log(Math.pow(a.ascent,2));
}

//calculate ascent
function calc_a() {
  a.height = a.rate*a.time;
  calcDisplacement(a);
}

function calc_d() {
  d.time = a.height/d.rate;
  calcDisplacement(d);
}

function calc_w() {
  w.displacement = w.speed*a.time + w.speed*d.time;
  //why does w.speed*(a.time + d.time) does not work?
  //console.log(a.time + d.time);

  if(w.direction < 180) {
    w.direction += 180;
  } else {
    w.direction = 360 - w.direction;
  }
}

function calc_f() {
  var ADdisp = a.displacement+d.displacement;
  var vectorAngle = 180-initData.heading+w.direction;
  f.displacement = Math.sqrt(Math.pow(ADdisp,2) + Math.pow(w.displacement,2) -2*ADdisp*w.displacement*Math.cos(vectorAngle));
  f.direction = initData.heading - Math.asin(ADdisp*Math.sin(vectorAngle)/f.displacement);
}

function print() {
  console.log("Ascent Vector: " + a.displacement + "m at " + initData.heading);
  console.log("Descent Vector: " + d.displacement + "m at " + initData.heading);
  console.log("Wind Vector: " + w.displacement + "m at " + w.direction);

  console.log("Final Vector: " + f.displacement + "m at " + f.direction);
}
