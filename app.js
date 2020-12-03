const dotenv = require("dotenv");
const GPIO = require("onoff").Gpio;
const Button = require("./button.js");

dotenv.config();

// Turn on the button LED when the app is running
const ledGpio = new GPIO(21, "out");
const button = new GPIO(3, "in", "falling");

button.watch((err) => {
  if (err) {
    throw err;
  }
  console.log('Big ass button pushed!');
});

//const buttonPushGpio = new GPIO(2, "in", "falling");
//const buttonLedGpio = new GPIO(4, "out");

//const button = new Button(3, 10, buttonLedGpio, buttonPushGpio);

function exit() {
  // Turn off the button LED when the app exits
  ledGpio.writeSync(0);
  ledGpio.unexport();
  button.unexport();
  //buttonLedGpio.writeSync(0);
  //buttonLedGpio.unexport();
  //buttonPushGpio.unexport();
  process.exit();
}

console.log("Big ass button is on!");
ledGpio.writeSync(1);

process.on("SIGINT", exit);
