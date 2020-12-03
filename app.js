const dotenv = require("dotenv");
const GPIO = require("onoff").Gpio;

dotenv.config();

const buttonPushGpio = new GPIO(3, "in", "falling", {debounceTimeout: 10});
const buttonLedGpio = new GPIO(4, "out");

let active = false;

function startBlink() {
  active = true;
  console.log('Big ass button gonna blink now');
  
  let count = 0;
  
  while (count <= 5) {
    buttonLedGpio.writeSync(count % 2);
    count++;
  } 
  
  this.reset();
}

function reset() {
  let active = false;
}

function exit() {
  buttonLedGpio.unexport();
  buttonPushGpio.unexport();
  process.exit();
}

buttonPushGpio.watch((err) => {
  if (err) {
    throw err;
  }
  console.log('Big ass button pressed!!');
  startBlink();
});

console.log("Big ass button is on!");

process.on("SIGINT", exit);
