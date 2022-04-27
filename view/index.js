
var Gpio = require('onoff').Gpio; 
var LED = new Gpio(4, 'out');

function myFunction() {
  LED.writeSync(1);
}