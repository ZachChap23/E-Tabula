pixel = require("node-pixel");
five = require("johnny-five");
sleep = require("system-sleep");


coord = 
[0, 1, 2, 3, 4, 5, 6, 7, 
15, 14, 13, 12, 11, 10, 9, 8,
16, 17, 18, 19, 20, 21, 22, 23,
31, 30, 29, 28, 27, 26, 25, 24,
32, 33, 34, 35, 36, 37, 38, 39,
47, 46, 45, 44, 43, 42, 41, 40,
48, 49, 50, 51, 52, 53, 54, 55,
63, 62, 61, 60, 59, 58, 57, 56];


var colours = [];
var square = 0;
var board = new five.Board({port: "COM11"});
var strip = null;

board.on("ready", function() {
  
  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 64}, ],
    gamma: 2.8,
  });
  for(i=0;i<8;i++){
    colours[i] = randcolor();
    console.log(colours[i])
    }
  strip.on("ready", function() {
    strip.color('white');
    strip.show()
    sleep(100);
    while(1) {
      halfcycle.apply(this, colours);
    }
    })
   
});



function cyclecoord() {
    for(x=0; x<arguments.length; x++) {
      for(i=0; i<64; i++) {
          strip.pixel(coord[i]).color(arguments[x]);
          strip.show();
          console.log(i);
          sleep(50);
      }
    }
}

function halfcyclecoord() {
    for(x=0; x<(arguments.length/2); x++) {
      for(i=0; i<32; i++) {
          strip.pixel(coord[i]).color(arguments[x]);
          strip.pixel(coord[i]).color(arguments[x+(arguments.length/2)]);
          strip.show();
          console.log(i);
          sleep(50);
      }
    }
}

function cycle() {
    for(x=0; x<arguments.length; x++) {
      for(i=0; i<64; i++) {
          strip.pixel(i).color(arguments[x]);
          strip.show();
          console.log(i);
          sleep(50);
      }
    }
}

function halfcycle() {
    for(x=0; x<(arguments.length/2); x++) {
      for(i=0; i<32; i++) {
          strip.pixel(i).color(arguments[x]);
          strip.pixel(i+32).color(arguments[x+(arguments.length/2)]);
          strip.show();
          console.log(i);
          sleep(50);
      }
    }
}
function randcolor() {
  colour = '#'+(Math.floor((Math.random() * 0xFFFFFF)).toString(16)).toUpperCase();
  while(colour.length < 7) {
      colour = colour + (Math.floor((Math.random() * 0xF)).toString(16)).toUpperCase();
  }
  return colour;
}