var sleep = require("system-sleep");
var pixel = require("node-pixel");
var five = require("johnny-five");
var Chess = require('./chess').Chess;
var SerialPort = require("serialport");

var data = []
var newdata = []

var board = new five.Board({port: "COM11"});
var port;
var base = []
for(i=0; i < 64; i++) {base[i] = 180}
var state = []
for(i=0; i < 64; i++) {state[i] = 0}
var colour;
var count = 0;
var coord = 
[0, 1, 2, 3, 4, 5, 6, 7, 
15, 14, 13, 12, 11, 10, 9, 8,
16, 17, 18, 19, 20, 21, 22, 23,
31, 30, 29, 28, 27, 26, 25, 24,
32, 33, 34, 35, 36, 37, 38, 39,
47, 46, 45, 44, 43, 42, 41, 40,
48, 49, 50, 51, 52, 53, 54, 55,
63, 62, 61, 60, 59, 58, 57, 56];

count = 0;
board.on("ready", function() {
  console.log("working");
  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 64}, ], // this is preferred form for definition
    gamma: 2.8, // set to a gamma that works nicely for WS2812
  });

  strip.on("ready", function() {
    console.log("working");
    strip.color('#000000')
    strip.show();
    console.log("strip is now", strip)

    port = new SerialPort("COM7", {baudRate: 115200, parser: SerialPort.parsers.readline("\n")});

    port.on('open', function(){
    	console.log('Serial Port Opened');
      	port.on('data', function(datain){
	        console.log(datain);
	        data = datain.toString().split(" ")
	        for (i=0; i<64; i++) {
	        	if (count == 0) {
	        		console.log('base');
	          		base[i] = Number(data[i]);
	          		count = 1;
	        	} 
	        	else {
	        		newdata[i] = Number(data[i]);
	        		console.log('new');
	        	}
	        	console.log(base[i]);
	        	console.log(newdata[i]);
		        colour = randcolor();
		        //console.log(colour);
		    	if(state[i] == 0) {
		        	if (newdata[i] < base[i]*0.95) {
			          	sleep(500)
			          	if (newdata[i] < base[i]*0.95) {
			          		state[i] = 1;
			          		count = 0;
			          		//strip.pixel(i).color('#000000');
			          		//console.log(i.toString()+' off~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
			          		//strip.show()
			          	}
		          	}
		        }
			    else if(state[i] == 1) {
			        if (newdata[i] > base[i]*0.95) {
		          		sleep(500);
			          	if (newdata[i] > base[i]*0.95) {
			          		state[i] = 0;
			          		count = 0;
			          		//strip.pixel(i).color('white')
			          		//console.log(i.toString()+' on----------------------------------------------------------------------');
			          		//strip.show();
			          	}
			        }
		    	}
			}
			for(x=0; x < 63; x = x+8) {
		    		console.log('-------'+state[x].toString()+state[x+1].toString()+state[x+2].toString()+state[x+3].toString()+state[x+4].toString()+state[x+5].toString()+state[x+6].toString()+state[x+7].toString())
		    	}
		    for(i=0; i < 63; i++) {
		    	if(state[i]==0) {
		    		strip.pixel(i).color('#00FF00') //green
		    	}
		    	else if(state[i]==1){
		    		strip.pixel(i).color('#FF0000') //red
		    	}
		    	strip.show()
		    }
        });
        //sleep(1000);
      });
    });
});

function randcolor() {
  colour = '#'+(Math.floor((Math.random() * 0xFFFFFF)).toString(16)).toUpperCase();
  while(colour.length < 7) {
      colour = colour + (Math.floor((Math.random() * 0xF)).toString(16)).toUpperCase();
  }
  return colour;
}