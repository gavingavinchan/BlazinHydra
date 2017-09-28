var i2c = require('i2c');
var wire = new i2c(0x30, {device: '/dev/i2c-1'});

wire.readBytes(0xce, 1, function(err, res){
	console.log(res);
});


wire.writeBytes(0x00, [0x00, 0x00], function(err){});
setTimeout( ()=> {
	wire.writeBytes(0x00, [0x10, 0x10], function(err){});
}, 1000);
