var sleep = require("system-sleep");
var pixel = require("node-pixel");
var five = require("johnny-five");
var Chess = require('./chess').Chess;
var SerialPort = require("serialport");

var newdata = [];
var board = new five.Board({port: "COM11"});
var port;
var state = []
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

    strip.show();
    console.log("strip is now", strip)

    port = new SerialPort("COM7", {baudRate: 115200, parser: SerialPort.parsers.readline("\n")});

    port.on('open', function(){
      console.log('Serial Port Opened');
      port.on('data', function(datain){
          data = datain.toString().split(" ")
        
        for (i=0; i<64; i++) {
          strip.pixel(i).color(sensor_hex(data[i]));
        }
        strip.show();
        //sleep(1000);
      });
    });
  });


});

function sensor_hex(value) {
    console.log(value);
    x = Number(value)
    x = Math.round((0xFF) * (x - 160) / (220 - 160));
    if (x < 0) { x = x*-1; }
    console.log(x);
    x = x.toString(16).toUpperCase().slice(0, 6);
    while(x.length < 6) {
      x = '0' + x
      console.log('check');
    }
    x = '#' + x
  console.log(x);
  return x;
}

function randcolor() {
  colour = '#'+(Math.floor((Math.random() * 0xFFFFFF)).toString(16)).toUpperCase();
  while(colour.length < 7) {
      colour = colour + (Math.floor((Math.random() * 0xF)).toString(16)).toUpperCase();
  }
  return colour;
}