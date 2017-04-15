var sleep = require("system-sleep");
var pixel = require("node-pixel");
var five = require("johnny-five");
var Chess = require('./chess').Chess;
var SerialPort = require("serialport");

var board = new five.Board({port: "COM11"});

var chess = new Chess();
var strip = 0;

console.log(chess.pgn());
var count = 0;
var x = 0;



var squares = [
  "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
  "h7", "g7", "f7", "e7", "d7", "c7", "b7", "a7",
  "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
  "h5", "g5", "f5", "e5", "d5", "c5", "b5", "a5",
  "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
  "h3", "g3", "f3", "e3", "d3", "c3", "b3", "a3",
  "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
  "h1", "g1", "f1", "e1", "d1", "c1", "b1", "a1"]

var port;
var c=0;

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

    for(i=0; i<64; i++){
      if (i>=48 || i<=15){
        strip.pixel(i).color("#880000");

      }else{
        if(i%2==0){
          strip.pixel(i).color("#888888");
        } else {
          strip.pixel(i).color("#008800");
        }
      }
    }

    strip.show();
    console.log("strip is now", strip)

    port = new SerialPort("COM7", {baudRate: 115200, parser: SerialPort.parsers.readline("\n")});

    port.on('open', function(){
      console.log('Serial Port Opened');
      port.on('data', function(datain){
        if (count == 0) {
          data = datain.toString().split(" ")
        } else {
          newdata = datain.toString().split(" ")
        }
        for (i=0; i<64; i++) {
          if (count == 0){
            data[i] = Number(data[i]);
            console.log("data")
          } else {
            newdata[i] = Number(newdata[i]);
            if ((newdata[i] < (data[i] * 0.945)) && (c == 1)){
            	sleep(2000);
	        	if ((newdata[i] < (data[i] * 0.945)) && (c == 1)){
	              console.log("~~~~~~~~~~~~~~trigger~~~~~~~~~~~~~~~");
	              strip.pixel(i).color("#880000"); //Red
	              strip.show();
	              c = 0;
	              chess.move(squares[i]);
	              x = 1;
	          }

            } else if ((newdata[i] > data[i] * 1.085) && (c == 0)){
              if(i%2==0){
                console.log("w");
                strip.pixel(i).color("#888888"); //White
                strip.show();
              } else {
              	console.log("g");
                strip.pixel(i).color("#008800"); //Green
                strip.show();
              }
              c+=1;
              m = chess.moves({square: squares[i]});
              for (j=0; j < m.length; j++){
                console.log("p");
                strip.pixel((squares.indexOf(m[j]))).color("#880088"); //Purple
                strip.show();
              }
              console.log(chess.history());
            }
          }
        }

        if(x==0) {
        	count = 1;
        	console.log("norm");
        	console.log(chess.history());
        } else if(x==1) {
        	console.log("---------------------weird-------------");
        	count = 0;
        	x = 0;
        }
        //sleep(1000);
      });
    });
  });


});
