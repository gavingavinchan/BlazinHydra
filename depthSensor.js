var i2c = require('i2c');

var coefficient = [];
const CMD_RESET = 0x1E, CMD_PROM = 0xA0, CMD_ADC_READ = 0xA0, CMD_ADC_CONV = 0x40;
var wire; 

function init(addr){
	wire = new i2c(addr);
	reset(wire);
}

function usleep(microseconds) {  
    var start = new Date().getTime();  
    while (new Date() < (start + microseconds/1000));  
    return true;  
} 

function reset(){
	wire.writeBytes(CMD_RESET, [], function(err){
		usleep(3000);
	});
}

function begin(call){
	coefficient = [];
	/*
	for(i=0;i<8;i++){
		wire.readBytes(CMD_PROM + (i*2), 2, (err, res)=>{
			coefficient[i] = (res[0] << 8) | res[1];
		});
	}
	*/
	var readProm = function(offset){
		console.log(offset);
		if (offset>=8) call(coefficient);
		wire.readBytes(CMD_PROM + (offset*2), 2, (err, res)=>{
			coefficient[offset] = (res[0]<<8) | res[1];
			readProm(offset+1);
		});
	}
	
	readProm(0);
}

init(0x76);
begin((coefficient)=>{
	console.log(coefficient);
});
