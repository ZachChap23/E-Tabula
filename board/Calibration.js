var fs = require('fs');
var SerialPort = require("serialport");

port = new SerialPort("COM7", {baudRate: 115200, parser: SerialPort.parsers.readline("\n")});

port.on('open', function(){
    console.log('Serial Port Opened');
    port.on('data', function(datain){
    	console.log(datain);
		fs.writeFile("./calibration", datain, function(err) {
	    	if(err) {
	        	return console.log(err);
	    	}

	    	console.log("The file was saved!");
		});
	});
}); 