var fs = require('fs')
var base = []
var calibration = fs.readFileSync('./calibration', 'utf8')
base = calibration.toString().split(" ");
for(i = 0; i < 64; i++) {
	base[i] = Number(base[i])-2
	console.log(base[i])
}
console.log(calibration);
