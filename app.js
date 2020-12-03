const dotenv = require("dotenv");
const GPIO = require("onoff").Gpio;

dotenv.config();

const buttonPushGpio = new GPIO(3, "in", "falling", {debounceTimeout: 10});
const buttonLedGpio = new GPIO(4, "out");

let active = false;
let blinkInterval;

function startBlink() {
  active = true;
  console.log('Big ass button gonna blink now');
  
  let count = 0;
  
  blinkInterval = setInterval(() => {
    if (count <= 5) {
      console.log(`count: ${count}`);
      buttonLedGpio.writeSync(count % 2);
      count++;  
    } else {
      console.log('all done!');
      reset();
    }
  }, 1000);
  
  reset();
}

function reset() {
  let active = false;
  clearInterval(blinkInterval);
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
